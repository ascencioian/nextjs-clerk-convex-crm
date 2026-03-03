"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type ProfileFormState = {
  businessName: string;
  isCertifiedOrLicensed: boolean;
  hasBackgroundCheck: boolean;
  isInsured: boolean;
  workingHoursText: string;
  emergencyPhone: string;
  businessPhone: string;
  aboutMe: string;
  worksResidential: boolean;
  worksCommercial: boolean;
  services: Array<string>;
  yearsOfExperience: string;
  regionCovered: string;
  howYouCharge: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  snapchat: string;
};

const EMPTY_FORM: ProfileFormState = {
  businessName: "",
  isCertifiedOrLicensed: false,
  hasBackgroundCheck: false,
  isInsured: false,
  workingHoursText: "",
  emergencyPhone: "",
  businessPhone: "",
  aboutMe: "",
  worksResidential: true,
  worksCommercial: false,
  services: [],
  yearsOfExperience: "",
  regionCovered: "",
  howYouCharge: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  snapchat: "",
};

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export default function ProfilePage() {
  const profile = useQuery(api.businessProfiles.getMyProfile, {});
  const upsertMyProfile = useMutation(api.businessProfiles.upsertMyProfile);
  const generateUploadUrl = useMutation(api.businessProfiles.generateHeadshotUploadUrl);
  const setMyHeadshot = useMutation(api.businessProfiles.setMyHeadshot);

  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM);
  const [serviceInput, setServiceInput] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile === undefined) {
      return;
    }
    if (profile === null) {
      setForm(EMPTY_FORM);
      return;
    }
    setForm({
      businessName: profile.businessName ?? "",
      isCertifiedOrLicensed: profile.isCertifiedOrLicensed ?? false,
      hasBackgroundCheck: profile.hasBackgroundCheck ?? false,
      isInsured: profile.isInsured ?? false,
      workingHoursText: profile.workingHoursText ?? "",
      emergencyPhone: profile.emergencyPhone ?? "",
      businessPhone: profile.businessPhone ?? "",
      aboutMe: profile.aboutMe ?? "",
      worksResidential: profile.worksResidential ?? false,
      worksCommercial: profile.worksCommercial ?? false,
      services: profile.services ?? [],
      yearsOfExperience:
        profile.yearsOfExperience === null || profile.yearsOfExperience === undefined
          ? ""
          : String(profile.yearsOfExperience),
      regionCovered: profile.regionCovered ?? "",
      howYouCharge: profile.howYouCharge ?? "",
      facebook: profile.facebook ?? "",
      instagram: profile.instagram ?? "",
      tiktok: profile.tiktok ?? "",
      snapchat: profile.snapchat ?? "",
    });
  }, [profile]);

  const headshotUrl = useMemo(() => {
    if (!profile || profile === undefined) {
      return null;
    }
    return profile.headshotUrl ?? null;
  }, [profile]);

  const addService = () => {
    const next = serviceInput.trim();
    if (!next) {
      return;
    }
    if (form.services.includes(next)) {
      setServiceInput("");
      return;
    }
    setForm((prev) => ({ ...prev, services: [...prev.services, next] }));
    setServiceInput("");
  };

  const onServiceKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addService();
    }
  };

  const removeService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((value) => value !== service),
    }));
  };

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError("");
    setSaveMessage("");

    try {
      const yearsParsed = form.yearsOfExperience.trim()
        ? Number.parseInt(form.yearsOfExperience.trim(), 10)
        : null;

      await upsertMyProfile({
        businessName: form.businessName.trim(),
        isCertifiedOrLicensed: form.isCertifiedOrLicensed,
        hasBackgroundCheck: form.hasBackgroundCheck,
        isInsured: form.isInsured,
        workingHoursText: optionalString(form.workingHoursText),
        emergencyPhone: optionalString(form.emergencyPhone),
        businessPhone: optionalString(form.businessPhone),
        aboutMe: optionalString(form.aboutMe),
        worksResidential: form.worksResidential,
        worksCommercial: form.worksCommercial,
        services: form.services,
        yearsOfExperience: Number.isNaN(yearsParsed) ? null : yearsParsed,
        regionCovered: optionalString(form.regionCovered),
        howYouCharge: optionalString(form.howYouCharge),
        facebook: optionalString(form.facebook),
        instagram: optionalString(form.instagram),
        tiktok: optionalString(form.tiktok),
        snapchat: optionalString(form.snapchat),
      });
      setSaveMessage("Profile saved.");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const onHeadshotSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setSaveError("Headshot must be JPG or PNG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Headshot must be 5MB or smaller.");
      return;
    }

    setIsUploading(true);
    setSaveMessage("");
    setSaveError("");

    try {
      const uploadUrl = await generateUploadUrl({});
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadResponse.ok) {
        throw new Error("Headshot upload failed.");
      }

      const { storageId } = (await uploadResponse.json()) as { storageId: Id<"_storage"> };
      await setMyHeadshot({ storageId });
      setSaveMessage("Headshot uploaded.");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to upload headshot.");
    } finally {
      setIsUploading(false);
      event.currentTarget.value = "";
    }
  };

  if (profile === undefined) {
    return <main className="p-8">Loading profile...</main>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Business profile</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Create or update your profile. One profile is stored per account.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm underline underline-offset-4">
            Home
          </Link>
          <Link href="/admin/businesses" className="text-sm underline underline-offset-4">
            Admin list
          </Link>
          <UserButton />
        </div>
      </header>

      <form
        onSubmit={onSave}
        className="space-y-6 rounded-xl border border-zinc-200 bg-[var(--surface)] p-6 dark:border-zinc-700"
      >
        <section className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Business name</span>
            <input
              required
              value={form.businessName}
              onChange={(event) => setForm((prev) => ({ ...prev, businessName: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Business phone</span>
            <input
              value={form.businessPhone}
              onChange={(event) => setForm((prev) => ({ ...prev, businessPhone: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium">About me</span>
            <textarea
              value={form.aboutMe}
              onChange={(event) => setForm((prev) => ({ ...prev, aboutMe: event.target.value }))}
              className="min-h-28 rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isCertifiedOrLicensed}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isCertifiedOrLicensed: event.target.checked }))
              }
            />
            Certified/licensed
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.hasBackgroundCheck}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, hasBackgroundCheck: event.target.checked }))
              }
            />
            Background check
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isInsured}
              onChange={(event) => setForm((prev) => ({ ...prev, isInsured: event.target.checked }))}
            />
            Insured
          </label>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-medium">Services</p>
          <div className="flex flex-wrap gap-2">
            {form.services.map((service) => (
              <button
                key={service}
                type="button"
                className="rounded-full bg-zinc-200 px-3 py-1 text-xs dark:bg-zinc-700"
                onClick={() => removeService(service)}
                title="Remove service"
              >
                {service} x
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={serviceInput}
              onChange={(event) => setServiceInput(event.target.value)}
              onKeyDown={onServiceKeyDown}
              placeholder="Add a service and press Enter"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
            <button
              type="button"
              onClick={addService}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              Add
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Working hours</span>
            <input
              value={form.workingHoursText}
              onChange={(event) => setForm((prev) => ({ ...prev, workingHoursText: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Emergency phone</span>
            <input
              value={form.emergencyPhone}
              onChange={(event) => setForm((prev) => ({ ...prev, emergencyPhone: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Years of experience</span>
            <input
              value={form.yearsOfExperience}
              onChange={(event) => setForm((prev) => ({ ...prev, yearsOfExperience: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Region covered</span>
            <input
              value={form.regionCovered}
              onChange={(event) => setForm((prev) => ({ ...prev, regionCovered: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.worksResidential}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, worksResidential: event.target.checked }))
              }
            />
            Works residential
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.worksCommercial}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, worksCommercial: event.target.checked }))
              }
            />
            Works commercial
          </label>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">How you charge</span>
            <input
              value={form.howYouCharge}
              onChange={(event) => setForm((prev) => ({ ...prev, howYouCharge: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <div />
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Facebook</span>
            <input
              value={form.facebook}
              onChange={(event) => setForm((prev) => ({ ...prev, facebook: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Instagram</span>
            <input
              value={form.instagram}
              onChange={(event) => setForm((prev) => ({ ...prev, instagram: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">TikTok</span>
            <input
              value={form.tiktok}
              onChange={(event) => setForm((prev) => ({ ...prev, tiktok: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Snapchat</span>
            <input
              value={form.snapchat}
              onChange={(event) => setForm((prev) => ({ ...prev, snapchat: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            />
          </label>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-medium">Headshot</p>
          {headshotUrl ? (
            // Signed Convex storage URLs are dynamic, so we render a standard img tag here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={headshotUrl}
              alt="Profile headshot"
              className="h-24 w-24 rounded-full border border-zinc-300 object-cover dark:border-zinc-700"
            />
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">No headshot uploaded yet.</p>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={onHeadshotSelected}
            disabled={isUploading}
            className="text-sm"
          />
        </section>

        {saveMessage ? <p className="text-sm text-emerald-700">{saveMessage}</p> : null}
        {saveError ? <p className="text-sm text-red-700">{saveError}</p> : null}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </main>
  );
}
