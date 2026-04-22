import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-body font-[800] whitespace-nowrap",
    "transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer border-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "[background:linear-gradient(135deg,var(--color-accent),var(--color-accent-hover))]",
          "text-[#fffaf2]",
          "hover:brightness-110 active:brightness-95",
        ],
        secondary: [
          "bg-white/90 border border-[var(--color-border)]",
          "text-[var(--color-text-primary)]",
          "hover:bg-[var(--color-surface-soft)] active:bg-[var(--navy-100)]",
        ],
        ghost: [
          "bg-transparent",
          "text-[var(--color-text-primary)]",
          "hover:bg-[var(--color-surface-soft)]",
        ],
        danger: [
          "bg-[var(--color-danger)]",
          "text-white",
          "hover:brightness-110 active:brightness-90",
        ],
      },
      size: {
        sm: "min-h-[36px] px-3 text-[var(--text-sm)] rounded-[var(--radius-full)]",
        md: "min-h-[46px] px-4 text-[var(--text-base)] rounded-[var(--radius-full)]",
        lg: "min-h-[54px] px-6 text-[var(--text-lg)] rounded-[var(--radius-full)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
