import * as React from "react";
import { StatusBadge } from "../../primitives/StatusBadge/StatusBadge";
import type { PaymentStatus } from "../../primitives/StatusBadge/StatusBadge";
import { cn } from "../../utils/cn";

const STATUS_MAP: Record<string, PaymentStatus> = {
  Pago:      "paid",
  Atrasado:  "late",
  Cancelado: "canceled",
  Pendente:  "pending",
};

export interface PaymentRowData {
  student: string;
  plan: string;
  status: string;
  amount: string;
  date: string;
}

export interface PaymentRowProps extends PaymentRowData {
  className?: string;
  onClick?: () => void;
}

export function PaymentRow({
  student,
  plan,
  status,
  amount,
  date,
  className,
  onClick,
}: PaymentRowProps) {
  const paymentStatus: PaymentStatus = STATUS_MAP[status] ?? "pending";

  return (
    <div
      role="row"
      onClick={onClick}
      className={cn(
        "grid gap-3 px-3 py-4 rounded-[var(--radius-lg)]",
        "bg-[rgba(249,252,255,0.94)] hover:bg-[var(--color-surface-soft)]",
        "transition-colors duration-[var(--duration-fast)]",
        "grid-cols-[1.2fr_1fr_0.8fr_0.7fr_0.8fr]",
        "max-sm:grid-cols-1 max-sm:gap-2",
        onClick && "cursor-pointer",
        className
      )}
    >
      <span className="font-body font-[700] text-[var(--text-sm)] text-[var(--color-text-primary)] truncate">
        {student}
      </span>
      <span className="font-body text-[var(--text-sm)] text-[var(--color-text-muted)] truncate">
        {plan}
      </span>
      <StatusBadge status={paymentStatus} size="sm" />
      <span className="font-body font-[700] text-[var(--text-sm)] text-[var(--color-text-primary)]">
        {amount}
      </span>
      <span className="font-body text-[var(--text-sm)] text-[var(--color-text-muted)]">
        {date}
      </span>
    </div>
  );
}

PaymentRow.displayName = "PaymentRow";
