import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-body font-[800]",
    "rounded-[var(--radius-full)]",
  ],
  {
    variants: {
      variant: {
        neutral: "bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]",
        success: "bg-[var(--color-success-soft)] text-[var(--color-accent-active)]",
        warning: "bg-[var(--amber-100)] text-[var(--amber-600)]",
        danger:  "bg-[var(--red-100)] text-[var(--red-500)]",
        info:    "bg-[var(--navy-100)] text-[var(--navy-700)]",
      },
      size: {
        sm: "min-h-[26px] px-[10px] text-[var(--text-xs)]",
        md: "min-h-[32px] px-3 text-[var(--text-sm)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);
