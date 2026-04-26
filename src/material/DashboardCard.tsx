import Card, { type CardProps } from "@mui/material/Card";
import CardContent, { type CardContentProps } from "@mui/material/CardContent";
import type { SxProps, Theme } from "@mui/material/styles";
import { alpha, useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { kpiCardSurfaceGradient } from "./surfaces";

type DashboardCardVariant = "default" | "kpi" | "muted" | "emphasis";

interface DashboardCardProps extends Omit<CardProps, "variant"> {
  surface?: DashboardCardVariant;
  fullHeight?: boolean;
  contentSx?: SxProps<Theme>;
  contentProps?: Omit<CardContentProps, "sx" | "children">;
  children: ReactNode;
}

const defaultContentSx: SxProps<Theme> = {
  p: { xs: 2, sm: 1.75, lg: 1.25 },
  "&:last-child": {
    pb: { xs: 2, sm: 1.75, lg: 1.25 }
  }
};

export function DashboardCard({
  surface = "default",
  fullHeight = false,
  sx,
  contentSx,
  contentProps,
  children,
  ...cardProps
}: DashboardCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const surfaceSx: Record<DashboardCardVariant, SxProps<Theme>> = {
    default: { boxShadow: "none" },
    kpi: { boxShadow: "none", background: kpiCardSurfaceGradient(theme) },
    muted: {
      boxShadow: "none",
      bgcolor: isDark ? alpha(theme.palette.background.paper, 0.82) : alpha(theme.palette.primary.main, 0.04)
    },
    emphasis: {
      boxShadow: "none",
      bgcolor: isDark ? alpha(theme.palette.primary.main, 0.16) : alpha(theme.palette.primary.main, 0.08)
    }
  };

  return (
    <Card {...cardProps} sx={{ ...(fullHeight ? { height: "100%" } : null), ...surfaceSx[surface], ...sx }}>
      <CardContent {...contentProps} sx={{ ...defaultContentSx, ...contentSx }}>
        {children}
      </CardContent>
    </Card>
  );
}
