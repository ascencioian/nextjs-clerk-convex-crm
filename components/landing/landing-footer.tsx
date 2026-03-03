import Link from "next/link";
import { Container } from "@/components/ui/container";

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
      <Container className="flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
        <p>Business CRM MVP</p>
        <div className="flex items-center gap-4">
          <Link href="/portal/profile" className="underline underline-offset-4">
            Profile portal
          </Link>
          <Link href="/admin/businesses" className="underline underline-offset-4">
            Admin businesses
          </Link>
        </div>
      </Container>
    </footer>
  );
}
