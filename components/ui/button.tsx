import { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/components/ui/cx";

type ButtonVariant = "primary" | "secondary" | "ghost";

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  const variantClass =
    variant === "primary"
      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
      : variant === "secondary"
        ? "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800";

  return (
    <button
      className={cx(
        "inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClass,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
