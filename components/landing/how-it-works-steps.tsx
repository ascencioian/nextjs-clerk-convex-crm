import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    title: "Create your account",
    body: "Sign up with Clerk authentication and securely access your private portal.",
  },
  {
    title: "Complete your profile",
    body: "Add business, compliance, contact, and services fields backed by Convex.",
  },
  {
    title: "Launch and update",
    body: "Keep your landing information current and continue onboarding in your portal.",
  },
];

export function HowItWorksSteps() {
  return (
    <section id="steps" className="py-10 sm:py-14">
      <Container className="space-y-6">
        <SectionHeading
          eyebrow="Getting started"
          title="Three clear onboarding steps"
          description="The landing page is optimized for quick understanding on mobile and scales cleanly on desktop."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Step {index + 1}
              </p>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{step.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
