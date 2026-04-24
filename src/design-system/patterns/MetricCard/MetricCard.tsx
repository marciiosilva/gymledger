import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../../primitives/Card/Card";
import { cn } from "../../utils/cn";

type MetricVariant = "emerald" | "blue" | "amber" | "slate";
type TrendDirection = "up" | "down";

export interface MetricCardProps {
  title: string;
  value: string;
  delta?: string;
  trend?: TrendDirection;
  variant?: MetricVariant;
  className?: string;
}

export function MetricCard({
  title,
  value,
  delta,
  trend,
  variant = "slate",
  className,
}: MetricCardProps) {
  return (
    <Card
      variant={variant}
      className={cn("min-h-[152px] p-5 flex flex-col", className)}
    >
      <p className="font-body text-[var(--text-xs)] font-[800] uppercase tracking-[0.08em] text-[var(--color-text-muted)] m-0">
        {title}
      </p>

      <strong className="block mt-4 font-display font-[700] text-[var(--text-2xl)] text-[var(--color-text-primary)] tracking-tight leading-none">
        {value}
      </strong>

      {delta && (
        <p className="flex items-center gap-1 mt-3 font-body text-[var(--text-sm)] text-[var(--color-text-muted)] m-0 leading-[1.5]">
          {trend === "up" && <TrendingUp className="size-3.5 text-[var(--color-accent)] shrink-0" />}
          {trend === "down" && <TrendingDown className="size-3.5 text-[var(--color-warning)] shrink-0" />}
          {delta}
        </p>
      )}
    </Card>
  );
}

MetricCard.displayName = "MetricCard";
