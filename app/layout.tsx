import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AppProviders } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM MVP",
  description: "Clerk and Convex CRM MVP",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "pk_test_placeholder";

  return (
    <html lang="en">
      <ClerkProvider publishableKey={publishableKey}>
        <body className="antialiased">
          <AppProviders>{children}</AppProviders>
        </body>
      </ClerkProvider>
    </html>
  );
}
