"use client";

export default function AdminBusinessesError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Admin access required</h1>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
        {error.message || "You do not have permission to view this page."}
      </p>
    </main>
  );
}
