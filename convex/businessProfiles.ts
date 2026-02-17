import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const HEADSHOT_MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_HEADSHOT_CONTENT_TYPES = new Set(["image/jpeg", "image/png"]);

async function requireCurrentUserId(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }
  return identity.subject;
}

function requireAdmin(userId: string) {
  const adminUserId = process.env.ADMIN_USER_ID;
  if (!adminUserId || userId !== adminUserId) {
    throw new Error("Forbidden");
  }
}

export const getMyProfile = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const userId = await requireCurrentUserId(ctx);
    const profile = await ctx.db
      .query("businessProfiles")
      .withIndex("by_ownerUserId", (q) => q.eq("ownerUserId", userId))
      .unique();

    if (!profile) {
      return null;
    }

    const headshotUrl = profile.headshotStorageId
      ? await ctx.storage.getUrl(profile.headshotStorageId)
      : null;

    return {
      ...profile,
      headshotUrl,
    };
  },
});

export const upsertMyProfile = mutation({
  args: {
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
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const now = Date.now();

    const existing = await ctx.db
      .query("businessProfiles")
      .withIndex("by_ownerUserId", (q) => q.eq("ownerUserId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        tenantType: "user",
        tenantId: userId,
        ownerUserId: userId,
        updatedAt: now,
      });
      return null;
    }

    await ctx.db.insert("businessProfiles", {
      ...args,
      tenantType: "user",
      tenantId: userId,
      ownerUserId: userId,
      createdAt: now,
      updatedAt: now,
      headshotStorageId: null,
    });
    return null;
  },
});

export const generateHeadshotUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await requireCurrentUserId(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const setMyHeadshot = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const profile = await ctx.db
      .query("businessProfiles")
      .withIndex("by_ownerUserId", (q) => q.eq("ownerUserId", userId))
      .unique();

    if (!profile) {
      throw new Error("Profile not found. Save your profile first.");
    }

    const metadata = await ctx.db.system.get("_storage", args.storageId);
    if (!metadata) {
      throw new Error("Uploaded file not found.");
    }
    if (!ALLOWED_HEADSHOT_CONTENT_TYPES.has(metadata.contentType ?? "")) {
      throw new Error("Headshot must be JPG or PNG.");
    }
    if (metadata.size > HEADSHOT_MAX_BYTES) {
      throw new Error("Headshot must be 5MB or smaller.");
    }

    await ctx.db.patch(profile._id, {
      headshotStorageId: args.storageId,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const listAllProfilesForAdmin = query({
  args: {
    search: v.optional(v.string()),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    requireAdmin(userId);

    const allProfiles = await ctx.db.query("businessProfiles").order("desc").collect();
    const term = args.search?.trim().toLowerCase();

    const filtered = term
      ? allProfiles.filter((profile) => {
          const name = profile.businessName.toLowerCase();
          const phone = profile.businessPhone?.toLowerCase() ?? "";
          return name.includes(term) || phone.includes(term);
        })
      : allProfiles;

    return filtered.map((profile) => ({
      _id: profile._id,
      businessName: profile.businessName,
      businessPhone: profile.businessPhone ?? "",
      ownerUserId: profile.ownerUserId,
      updatedAt: profile.updatedAt,
      createdAt: profile.createdAt,
    }));
  },
});
