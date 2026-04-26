import type { SxProps, Theme } from "@mui/material/styles";

export const dashboardGridGap = { xs: 2, md: 1.25 };
export const dashboardSectionGap = { xs: 2, md: 1.5 };
export const dashboardClusterGap = { xs: 1.25, md: 0.9 };

export const dashboardKpiGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(auto-fit, minmax(210px, 1fr))"
  },
  gap: dashboardGridGap,
  alignItems: "stretch"
};

export const dashboardMainSplitSx: SxProps<Theme> = {
  display: "grid",
  gridAutoFlow: "row dense",
  gridTemplateColumns: {
    xs: "1fr",
    lg: "minmax(0, 2.25fr) minmax(300px, 1fr)",
    xl: "minmax(0, 2.4fr) minmax(320px, 1fr)"
  },
  gap: dashboardGridGap,
  alignItems: "start"
};

export const dashboardSubGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(auto-fit, minmax(280px, 1fr))"
  },
  gap: dashboardClusterGap,
  alignItems: "stretch"
};
