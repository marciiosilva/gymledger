import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { badgeVariants } from "./Badge.variants";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
);

Badge.displayName = "Badge";
