import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto flex max-w-5xl flex-col px-6 py-16 sm:px-8">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Business CRM MVP</h1>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>

        <div className="mt-20 rounded-2xl border border-zinc-200 bg-[var(--surface)] p-8 shadow-sm dark:border-zinc-700">
          <h2 className="text-4xl font-semibold tracking-tight">
            One place to manage your business profile
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-300">
            Create your profile once, keep it updated, and review submissions in a private
            admin view.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
            <Link
              href="/portal/profile"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Get started
            </Link>
          </div>
        </div>

        <div className="mt-8 flex gap-4 text-sm">
          <Link href="/portal/profile" className="underline underline-offset-4">
            Profile portal
          </Link>
          <Link href="/admin/businesses" className="underline underline-offset-4">
            Admin businesses
          </Link>
        </div>
      </section>
    </main>
  );
}
