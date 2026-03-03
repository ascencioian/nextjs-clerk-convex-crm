import { LandingBusinessProfile } from "@/components/landing/types";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function ProfileHighlights({ profile }: { profile: LandingBusinessProfile }) {
  return (
    <section className="py-10 sm:py-14">
      <Container className="space-y-6">
        <SectionHeading
          eyebrow="Business profile fields"
          title="Structured profile information from Convex"
          description="This section reflects the same business fields defined in the Convex data model and used across onboarding."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold">Coverage and service type</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{profile.regionCovered || "-"}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Residential: {profile.worksResidential ? "Yes" : "No"} | Commercial:{" "}
              {profile.worksCommercial ? "Yes" : "No"}
            </p>
          </Card>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold">Compliance</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Licensed: {profile.isCertifiedOrLicensed ? "Yes" : "No"}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Background checked: {profile.hasBackgroundCheck ? "Yes" : "No"}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Insured: {profile.isInsured ? "Yes" : "No"}
            </p>
          </Card>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold">Pricing</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{profile.howYouCharge || "-"}</p>
          </Card>
        </div>
      </Container>
    </section>
  );
}
