import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  businessProfiles: defineTable({
    ownerUserId: v.string(),
    tenantType: v.union(v.literal("user"), v.literal("org")),
    tenantId: v.string(),
    businessName: v.string(),
    isCertifiedOrLicensed: v.boolean(),
    hasBackgroundCheck: v.boolean(),
    isInsured: v.boolean(),
    workingHoursText: v.optional(v.string()),
    emergencyPhone: v.optional(v.string()),
    businessPhone: v.optional(v.string()),
    aboutMe: v.optional(v.string()),
    worksResidential: v.boolean(),
    worksCommercial: v.boolean(),
    services: v.array(v.string()),
    yearsOfExperience: v.optional(v.union(v.number(), v.null())),
    regionCovered: v.optional(v.string()),
    howYouCharge: v.optional(v.string()),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    snapchat: v.optional(v.string()),
    headshotStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_ownerUserId", ["ownerUserId"])
    .index("by_tenantType_and_tenantId", ["tenantType", "tenantId"]),
});
