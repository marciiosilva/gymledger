import * as React from "react";
import { Badge } from "../Badge/Badge";
import type { BadgeProps } from "../Badge/Badge";

export type PaymentStatus = "paid" | "late" | "canceled" | "pending";
export type StudentStatus = "active" | "inactive";
export type SubscriptionStatus = PaymentStatus | StudentStatus;

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  paid:     "Pago",
  late:     "Atrasado",
  canceled: "Cancelado",
  pending:  "Pendente",
  active:   "Ativo",
  inactive: "Inativo",
};

const STATUS_VARIANTS: Record<SubscriptionStatus, BadgeProps["variant"]> = {
  paid:     "success",
  late:     "warning",
  canceled: "danger",
  pending:  "neutral",
  active:   "success",
  inactive: "neutral",
};

export interface StatusBadgeProps
  extends Omit<BadgeProps, "variant"> {
  status: SubscriptionStatus;
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, children, ...props }, ref) => (
    <Badge
      ref={ref}
      variant={STATUS_VARIANTS[status]}
      {...props}
    >
      {children ?? STATUS_LABELS[status]}
    </Badge>
  )
);

StatusBadge.displayName = "StatusBadge";
