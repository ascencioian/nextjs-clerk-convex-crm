import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { ContactCaptureCTA } from "@/components/landing/contact-capture-cta";
import { demoBusinessProfile } from "@/components/landing/data";
import { HowItWorksSteps } from "@/components/landing/how-it-works-steps";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { toLandingBusinessProfile } from "@/components/landing/mappers";
import { ProfileHighlights } from "@/components/landing/profile-highlights";
import { api } from "@/convex/_generated/api";

export default async function Home() {
  const { userId, getToken } = await auth();
  const isSignedIn = Boolean(userId);

  let liveProfile: unknown = null;
  if (isSignedIn) {
    try {
      const token = await getToken({ template: "convex" });
      if (token) {
        liveProfile = await fetchQuery(api.businessProfiles.getMyProfile, {}, { token });
      }
    } catch (error) {
      console.error("Failed to load signed-in landing profile", error);
    }
  }

  const landingProfile = toLandingBusinessProfile(liveProfile) ?? demoBusinessProfile;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <LandingHeader isSignedIn={isSignedIn} />
      <LandingHero profile={landingProfile} isSignedIn={isSignedIn} />
      <ProfileHighlights profile={landingProfile} />
      <HowItWorksSteps />
      <ContactCaptureCTA isSignedIn={isSignedIn} />
      <LandingFooter />
    </main>
  );
}
