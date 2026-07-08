"use client";

// Scene3D — sân khấu 3D cho homepage (Layer 1 — Entry).
// Theo TEMPLATE/homepage/homepage_desktop.png: phòng tối editorial, bàn gỗ,
// máy tính AIO ở giữa (màn hình phát sáng), sách + bút làm đạo cụ.
// Bấm vào máy AIO → vào trang luyện đề (/exams). Model .glb từ ASSETS/models
// đã copy sang public/models để serve runtime cho useGLTF.

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Html, useTexture } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const HOVER_SCALE = 1.06;

const AIO_URL = "/models/all_in_one_pc.glb";
const BOOK_URL = "/models/stack_of_books.glb";
const PENCIL_URL = "/models/Pencil.glb";

useGLTF.preload(AIO_URL);
useGLTF.preload(BOOK_URL);
useGLTF.preload(PENCIL_URL);

const AIO_LEN = 1.15;

// ── Kích thước bàn (chia sẻ giữa Desk + bố trí phòng) ─────────────────────────
const TOP_W = 3.6;
const TOP_D = 1.7;
const TOP_T = 0.08;
const LEG_H = 1.4;
const LEG_BOTTOM = -TOP_T - LEG_H; // -1.48
const TABLE_BACK_Z = -TOP_D / 2; // -0.85

// ── Phòng (hậu cảnh) ──────────────────────────────────────────────────────────
const WALL_GAP = TOP_W * 0.1; // 0.36
const WALL_Z = TABLE_BACK_Z - WALL_GAP; // -1.21
const WALL_W = 14;
const WALL_H = 8;
const FLOOR_W = 16;
const FLOOR_D = 12;

const WALL_TEX_URL = "/images/wall-texture.jpg";
const FLOOR_TEX_URL = "/images/floor-texture.jpg";
useTexture.preload(WALL_TEX_URL);
useTexture.preload(FLOOR_TEX_URL);

type ModelProps = {
  url: string;
  target: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  active?: boolean;
  alignBackZ?: boolean;
};

function Model({
  url,
  target,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
  active = false,
  alignBackZ = false,
}: ModelProps) {
  const { scene } = useGLTF(url);
  const [rx, ry, rz] = rotation;
  const outerRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = outerRef.current;
    if (!g) return;
    const t = active ? HOVER_SCALE : 1;
    g.scale.x += (t - g.scale.x) * 0.15;
    g.scale.y = g.scale.z = g.scale.x;
  });

  const { scale, offset } = useMemo(() => {
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
    const offset: [number, number, number] = [
      -center.x * s,
      -box.min.y * s,
      (alignBackZ ? -box.min.z : -center.z) * s,
    ];
    return { scale: s, offset };
  }, [scene, target, rx, ry, rz, alignBackZ]);

  return (
    <group
      ref={outerRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <group scale={scale} position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function Desk() {
  const wood = (
    <meshStandardMaterial color="#c89b6a" roughness={0.85} metalness={0.05} />
  );
  const leg = (
    <meshStandardMaterial color="#8a8f99" roughness={0.5} metalness={0.4} />
  );
  const legX = TOP_W / 2 - 0.18;
  const legZ = TOP_D / 2 - 0.18;
  const legY = -TOP_T - LEG_H / 2;

  return (
    <group>
      <mesh position={[0, -TOP_T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[TOP_W, TOP_T, TOP_D]} />
        {wood}
      </mesh>
      {[
        [legX, legY, legZ],
        [-legX, legY, legZ],
        [legX, legY, -legZ],
        [-legX, legY, -legZ],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.06, LEG_H, 0.06]} />
          {leg}
        </mesh>
      ))}
    </group>
  );
}

function Room() {
  const [wall, floor] = useTexture([WALL_TEX_URL, FLOOR_TEX_URL]);

  useMemo(() => {
    wall.wrapS = wall.wrapT = THREE.RepeatWrapping;
    wall.repeat.set(3, 2);
    wall.colorSpace = THREE.SRGBColorSpace;
    floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
    floor.repeat.set(4, 3);
    floor.colorSpace = THREE.SRGBColorSpace;
  }, [wall, floor]);

  return (
    <group>
      <mesh
        position={[0, LEG_BOTTOM, WALL_Z + FLOOR_D / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[FLOOR_W, FLOOR_D]} />
        <meshStandardMaterial map={floor} roughness={1} />
      </mesh>
      <mesh position={[0, LEG_BOTTOM + WALL_H / 2, WALL_Z]} receiveShadow>
        <planeGeometry args={[WALL_W, WALL_H]} />
        <meshStandardMaterial map={wall} roughness={1} />
      </mesh>
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
    <group position={[0, -0.35, 0]}>
      <Room />

      <group>
        <Desk />

        <Model
          url={AIO_URL}
          target={AIO_LEN}
          position={[0, 0, -0.18]}
          rotation={[0, Math.PI, 0]}
          active={hovered}
          onClick={() => router.push("/exams")}
          onPointerOver={() => setCursor(true)}
          onPointerOut={() => setCursor(false)}
        />

        <Html position={[0, 1.35, -0.18]} center style={{ pointerEvents: "none" }}>
          <span
            className={`whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
              hovered
                ? "translate-y-0 text-zinc-200 opacity-100"
                : "translate-y-1 text-zinc-500 opacity-0"
            }`}
          >
            Nhấn để bắt đầu
          </span>
        </Html>

        <Model url={BOOK_URL} target={0.5} position={[1.05, 0, 0.3]} rotation={[0, -0.4, 0]} />
        <Model
          url={PENCIL_URL}
          target={0.62}
          position={[-1.0, 0, 0.35]}
          rotation={[Math.PI / 2, 0, 0.25]}
        />

        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.85}
          scale={7}
          blur={2.2}
          far={1.3}
        />
      </group>
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

      <ambientLight intensity={0.18} />
      <directionalLight
        castShadow
        position={[0, 9, -1.5]}
        intensity={2.1}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-6, 6, 6, -6, 0.1, 30]} />
      </directionalLight>

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
