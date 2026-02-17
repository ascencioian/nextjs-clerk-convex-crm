"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";

type AdminProfileRow = {
  _id: string;
  businessName: string;
  businessPhone: string;
  ownerUserId: string;
  updatedAt: number;
  createdAt: number;
};

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

export default function AdminBusinessesPage() {
  const [search, setSearch] = useState("");
  const queryArgs = useMemo(
    () => ({
      search: search.trim() ? search : undefined,
    }),
    [search],
  );

  const profiles = useQuery(
    api.businessProfiles.listAllProfilesForAdmin,
    queryArgs,
  ) as Array<AdminProfileRow> | undefined;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin businesses</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Private list of all submitted business profiles.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm underline underline-offset-4">
            Home
          </Link>
          <Link href="/portal/profile" className="text-sm underline underline-offset-4">
            Profile
          </Link>
          <UserButton />
        </div>
      </header>

      <div className="mb-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by business name or phone"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </div>

      {profiles === undefined ? (
        <p>Loading profiles...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-[var(--surface)] dark:border-zinc-700">
          <table className="min-w-full text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-700">
              <tr className="text-left">
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Owner user ID</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile._id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3">{profile.businessName}</td>
                  <td className="px-4 py-3">{profile.businessPhone || "-"}</td>
                  <td className="px-4 py-3">{profile.ownerUserId}</td>
                  <td className="px-4 py-3">{formatTimestamp(profile.updatedAt)}</td>
                </tr>
              ))}
              {profiles.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-zinc-500" colSpan={4}>
                    No profiles found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
