import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export function ContactCaptureCTA({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section id="contact" className="py-10 sm:py-14">
      <Container>
        <Card className="space-y-4 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Start the setup flow and submit your business contact details
          </h2>
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
            Use the profile portal to enter your business fields, services, and communication details.
            Your data stays tied to your authenticated account.
          </p>
          <div className="flex flex-wrap gap-3">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="secondary">Sign in</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="secondary">Sign up</Button>
                </SignUpButton>
              </>
            ) : null}
            <Link href="/portal/profile">
              <Button>Get started</Button>
            </Link>
          </div>
        </Card>
      </Container>
    </section>
  );
}
