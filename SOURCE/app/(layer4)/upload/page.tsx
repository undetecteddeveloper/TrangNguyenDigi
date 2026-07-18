// S-01 Upload — /upload (UGC v2.0, Task 6.2). Server guard → /?auth=signin
// (AC-002). Form là client component (giữ state metadata + file).

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { UploadForm } from "@/app/(layer4)/_components/UploadForm";

export default async function UploadPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/?auth=signin");

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <UploadForm />
    </main>
  );
}
