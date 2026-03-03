import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function LandingHeader({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <header className="border-b border-zinc-200/80 bg-[var(--surface)]/80 backdrop-blur dark:border-zinc-800/80">
      <Container className="flex min-h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          <p className="text-sm font-semibold">Business CRM</p>
        </div>
        <nav className="hidden items-center gap-5 text-sm text-zinc-600 dark:text-zinc-300 md:flex">
          <Link href="#overview">Overview</Link>
          <Link href="#steps">How it works</Link>
          <Link href="#contact">Get started</Link>
        </nav>
        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="secondary">Sign up</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
