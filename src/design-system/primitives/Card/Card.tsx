import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const cardVariants = cva(
  "border border-[var(--color-border)] rounded-[var(--radius-xl)] bg-white/96",
  {
    variants: {
      variant: {
        elevated: "shadow-[var(--shadow-lg)]",
        flat:     "shadow-none",
        tinted:   [
          "shadow-[var(--shadow-lg)]",
          "bg-gradient-to-b from-white to-[var(--surface-tint)]",
        ],
        emerald: [
          "shadow-[var(--shadow-lg)]",
          "bg-gradient-to-br from-[rgba(30,182,74,0.14)] to-white/98",
          "border-[rgba(30,182,74,0.16)]",
        ],
        blue: [
          "shadow-[var(--shadow-lg)]",
          "bg-gradient-to-br from-[rgba(17,43,77,0.08)] to-white/98",
          "border-[rgba(17,43,77,0.14)]",
        ],
        amber: [
          "shadow-[var(--shadow-lg)]",
          "bg-gradient-to-br from-[rgba(184,108,24,0.12)] to-[rgba(255,253,249,0.92)]",
        ],
        slate: [
          "shadow-[var(--shadow-lg)]",
          "bg-gradient-to-br from-[rgba(17,43,77,0.06)] to-white/98",
        ],
        dark: [
          "bg-gradient-to-b from-[rgba(17,43,77,0.98)] to-[rgba(26,61,99,0.96)]",
          "border-white/5 text-[#f8f3eb]",
          "overflow-hidden",
        ],
      },
    },
    defaultVariants: {
      variant: "elevated",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
);
CardRoot.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-start justify-between gap-3 p-[22px] pb-0", className)}
    {...props}
  />
));
CardHeader.displayName = "Card.Header";

const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-[22px]", className)} {...props} />
));
CardBody.displayName = "Card.Body";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 p-[22px] pt-0 border-t border-[var(--color-border)] mt-auto",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "Card.Footer";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body:   CardBody,
  Footer: CardFooter,
});
