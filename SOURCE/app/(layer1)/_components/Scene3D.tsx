"use client";

// Scene3D — sân khấu 3D cho homepage (Layer 1 — Entry).
// Theo TEMPLATE/homepage/homepage_desktop.png: phòng tối editorial, bàn gỗ,
// máy tính AIO ở giữa (màn hình phát sáng), sách + bút làm đạo cụ.
// Bấm vào máy AIO → vào trang luyện đề (/exams). Model .glb từ ASSETS/models
// đã copy sang public/models để serve runtime cho useGLTF.

import { Canvas } from "@react-three/fiber";
import { useGLTF, ContactShadows, Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import * as THREE from "three";

const AIO_URL = "/models/all_in_one_pc.glb";
const BOOK_URL = "/models/stack_of_books.glb";
const PENCIL_URL = "/models/Pencil.glb";

useGLTF.preload(AIO_URL);
useGLTF.preload(BOOK_URL);
useGLTF.preload(PENCIL_URL);

type ModelProps = {
  url: string;
  /** Kích thước mục tiêu (chiều dài cạnh lớn nhất, theo đơn vị scene). */
  target: number;
  /** Vị trí đặt gốc-đáy của model trên bàn (y=0 là mặt bàn). */
  position?: [number, number, number];
  /** Xoay model (áp dụng trước khi tính bbox để vẫn đặt đáy chạm bàn đúng). */
  rotation?: [number, number, number];
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
};

// Model — nạp .glb, chuẩn hoá: xoay (nếu có) → scale theo target → căn tâm x/z
// và đặt đáy lên mặt bàn (y=0). Mỗi model dùng đúng 1 lần nên thao tác trực tiếp
// trên `scene` (không cần clone).
function Model({
  url,
  target,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
}: ModelProps) {
  const { scene } = useGLTF(url);
  const [rx, ry, rz] = rotation;

  const { scale, offset } = useMemo(() => {
    // QUAN TRỌNG: reset transform của scene về gốc TRƯỚC khi đo. Nếu không, mỗi
    // lần render lại đo trên scene đã scale/dời của lần trước → cộng dồn → model
    // nhảy loạn / biến mất khi re-render (vd hover). Chỉ bake rotation (không
    // cộng dồn) rồi đo; scale/offset áp lên group bọc ngoài, KHÔNG đụng scene.
    scene.position.set(0, 0, 0);
    scene.scale.set(1, 1, 1);
    scene.rotation.set(rx, ry, rz);
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    scene.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = target / maxDim;
    // Đưa tâm x/z về 0 và đáy (min.y) chạm mặt bàn (y=0), tính trong không gian
    // đã scale (nhân s) vì position của group áp sau scale trong ma trận node.
    const offset: [number, number, number] = [
      -center.x * s,
      -box.min.y * s,
      -center.z * s,
    ];
    return { scale: s, offset };
  }, [scene, target, rx, ry, rz]);

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Group bọc mang scale + offset — scene giữ transform gốc để lần đo sau
          ổn định (không cộng dồn). */}
      <group scale={scale} position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// Bàn gỗ dựng từ hình khối (không có model bàn riêng) — mặt bàn ở y=0.
function Desk() {
  const wood = (
    <meshStandardMaterial color="#c89b6a" roughness={0.85} metalness={0.05} />
  );
  const leg = (
    <meshStandardMaterial color="#8a8f99" roughness={0.5} metalness={0.4} />
  );
  const topW = 3.6;
  const topD = 1.7;
  const topT = 0.08;
  const legH = 1.4;
  const legX = topW / 2 - 0.18;
  const legZ = topD / 2 - 0.18;
  const legY = -topT - legH / 2;

  return (
    <group>
      {/* Mặt bàn — tâm đặt sao cho mặt trên ở y=0. */}
      <mesh position={[0, -topT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[topW, topT, topD]} />
        {wood}
      </mesh>
      {/* 4 chân kim loại mảnh. */}
      {[
        [legX, legY, legZ],
        [-legX, legY, legZ],
        [legX, legY, -legZ],
        [-legX, legY, -legZ],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.06, legH, 0.06]} />
          {leg}
        </mesh>
      ))}
    </group>
  );
}

function SceneContents() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  function setCursor(v: boolean) {
    setHovered(v);
    document.body.style.cursor = v ? "pointer" : "auto";
  }

  return (
    // Dời cả sân khấu xuống để camera (nhìn về gốc) ngắm vào quãng giữa bàn/máy.
    <group position={[0, -0.35, 0]}>
      <Desk />

      {/* Máy AIO — trung tâm, hơi lùi ra sau; bấm vào để vào luyện đề. */}
      <Model
        url={AIO_URL}
        target={1.15}
        position={[0, 0, -0.18]}
        rotation={[0, Math.PI, 0]}
        onClick={() => router.push("/exams")}
        onPointerOver={() => setCursor(true)}
        onPointerOut={() => setCursor(false)}
      />

      {/* Quầng sáng xanh nhạt từ màn hình (mô phỏng ảnh template). */}
      <pointLight
        position={[0, 0.7, 0.15]}
        intensity={hovered ? 4 : 2.4}
        distance={2.6}
        color="#bcd2ff"
      />

      {/* Đạo cụ: sách bên phải, bút bên trái. */}
      <Model url={BOOK_URL} target={0.5} position={[1.05, 0, 0.3]} rotation={[0, -0.4, 0]} />
      <Model
        url={PENCIL_URL}
        target={0.62}
        position={[-1.0, 0, 0.35]}
        rotation={[Math.PI / 2, 0, 0.25]}
      />

      {/* Bóng tiếp xúc đậm trên mặt bàn → vật thể nổi khối, "đặt" chứ không lơ lửng. */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.85}
        scale={7}
        blur={2.2}
        far={1.3}
      />
    </group>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.2, 4.7], fov: 38 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#0d0d11"]} />

      {/* Ánh sáng editorial tối: ambient rất yếu (để bóng đậm, nổi khối) +
          key light từ TRÊN CAO chiếu gần như thẳng xuống mặt bàn (hơi nghiêng về
          phía camera để bóng đổ ra trước, thấy được độ sâu). */}
      <ambientLight intensity={0.18} />
      <directionalLight
        castShadow
        position={[0, 9, -1.5]}
        intensity={2.1}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-6, 6, 6, -6, 0.1, 30]}
        />
      </directionalLight>

      {/* Sàn phòng tối hứng bóng chân bàn — chiều sâu phối cảnh như template. */}
      <mesh
        position={[0, -1.75, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#16161d" roughness={1} />
      </mesh>

      <Suspense
        fallback={
          <Html center>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              Đang tải…
            </span>
          </Html>
        }
      >
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
