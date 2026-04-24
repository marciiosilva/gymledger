import * as React from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Layers,
  Dumbbell,
  UserCheck,
  Sparkles,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../utils/cn";

export interface NavItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  badge?: number;
  active?: boolean;
  onClick?: () => void;
}

const DEFAULT_ICONS: Record<string, LucideIcon> = {
  Dashboard:   LayoutDashboard,
  Alunos:      Users,
  Financeiro:  CreditCard,
  Planos:      Layers,
  Treinos:     Dumbbell,
  Professores: UserCheck,
  IA:          Sparkles,
  Relatorios:  BarChart3,
};

export interface SidebarNavProps {
  items: NavItem[];
  className?: string;
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label="Navegação principal">
      {items.map((item) => {
        const Icon = item.icon ?? DEFAULT_ICONS[item.label];
        return (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-[var(--radius-md)]",
              "font-body font-[700] text-sm text-left w-full",
              "transition-colors duration-[var(--duration-fast)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
              item.active
                ? [
                    "bg-gradient-to-r from-[rgba(30,182,74,0.22)] to-[rgba(31,174,127,0.14)]",
                    "text-white shadow-[inset_0_0_0_1px_rgba(65,212,116,0.16)]",
                  ]
                : "text-[rgba(241,247,255,0.78)] hover:text-white hover:bg-white/8"
            )}
          >
            {Icon && <Icon className="size-4 shrink-0" />}
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge != null && item.badge > 0 && (
              <span
                className={cn(
                  "shrink-0 min-w-[20px] h-5 px-1.5 rounded-full",
                  "flex items-center justify-center",
                  "font-body text-[11px] font-[800]",
                  item.active
                    ? "bg-white/20 text-white"
                    : "bg-[rgba(30,182,74,0.3)] text-[var(--color-accent)]"
                )}
              >
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

SidebarNav.displayName = "SidebarNav";
