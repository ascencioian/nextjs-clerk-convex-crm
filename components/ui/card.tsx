import { ReactNode } from "react";
import { cx } from "@/components/ui/cx";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cx(
        "rounded-2xl border border-zinc-200 bg-[var(--surface)] p-5 dark:border-zinc-800",
        className,
      )}
    >
      {children}
    </article>
  );
}
