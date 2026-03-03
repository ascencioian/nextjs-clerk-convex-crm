import { LandingBusinessProfile } from "@/components/landing/types";

type UnknownRecord = Record<string, unknown>;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as Array<string>;
  }
  return value.filter((item): item is string => typeof item === "string");
}

function asNullableNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }
  return null;
}

export function toLandingBusinessProfile(profile: unknown): LandingBusinessProfile | null {
  if (!profile || typeof profile !== "object") {
    return null;
  }

  const source = profile as UnknownRecord;
  return {
    businessName: asString(source.businessName, "Your business"),
    aboutMe: asString(source.aboutMe),
    businessPhone: asString(source.businessPhone),
    emergencyPhone: asString(source.emergencyPhone),
    workingHoursText: asString(source.workingHoursText),
    services: asStringArray(source.services),
    yearsOfExperience: asNullableNumber(source.yearsOfExperience),
    regionCovered: asString(source.regionCovered),
    howYouCharge: asString(source.howYouCharge),
    worksResidential: asBoolean(source.worksResidential),
    worksCommercial: asBoolean(source.worksCommercial),
    isCertifiedOrLicensed: asBoolean(source.isCertifiedOrLicensed),
    hasBackgroundCheck: asBoolean(source.hasBackgroundCheck),
    isInsured: asBoolean(source.isInsured),
    facebook: asString(source.facebook),
    instagram: asString(source.instagram),
    tiktok: asString(source.tiktok),
    snapchat: asString(source.snapchat),
    headshotUrl: typeof source.headshotUrl === "string" ? source.headshotUrl : null,
  };
}
