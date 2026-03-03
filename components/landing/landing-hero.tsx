import { LandingBusinessProfile } from "@/components/landing/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function LandingHero({
  profile,
  isSignedIn,
}: {
  profile: LandingBusinessProfile;
  isSignedIn: boolean;
}) {
  const title = isSignedIn
    ? `Welcome back, ${profile.businessName}`
    : "A smarter way to launch your business profile";
  const subtitle = isSignedIn
    ? "Your landing overview is now hydrated from your Convex business profile data."
    : "Preview the onboarding flow, then sign up to publish your own profile details and contact information.";

  return (
    <section id="overview" className="py-10 sm:py-14">
      <Container className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <Badge>{isSignedIn ? "Personalized view" : "Demo preview"}</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.services.slice(0, 4).map((service) => (
              <Badge key={service}>{service}</Badge>
            ))}
          </div>
        </div>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-200 dark:text-zinc-900">
              {initialsFromName(profile.businessName)}
            </div>
            <div>
              <p className="text-sm font-semibold">{profile.businessName}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {profile.regionCovered || "Add your region"}
              </p>
            </div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {profile.aboutMe || "Add your business story so customers trust your services faster."}
          </p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Business phone</dt>
              <dd className="font-medium">{profile.businessPhone || "-"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Emergency</dt>
              <dd className="font-medium">{profile.emergencyPhone || "-"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Hours</dt>
              <dd className="font-medium">{profile.workingHoursText || "-"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Experience</dt>
              <dd className="font-medium">
                {profile.yearsOfExperience !== null ? `${profile.yearsOfExperience} years` : "-"}
              </dd>
            </div>
          </dl>
        </Card>
      </Container>
    </section>
  );
}
