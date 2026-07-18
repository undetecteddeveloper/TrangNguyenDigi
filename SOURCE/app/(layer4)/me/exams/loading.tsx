// Loading state cho /me/exams (+ nested [id]) — khối skeleton nhẹ.

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="bg-border/60 h-8 w-40 animate-pulse rounded" />
      <div className="mt-6 flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border-border bg-card/40 h-20 animate-pulse rounded-lg border" />
        ))}
      </div>
    </main>
  );
}
