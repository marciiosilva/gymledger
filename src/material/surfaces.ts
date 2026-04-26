import { alpha, type Theme } from "@mui/material/styles";

/**
 * Leve highlight em cards de metrica, legivel em light e dark (evita "branco fixo" no escuro).
 */
export function kpiCardSurfaceGradient(theme: Theme): string {
  const top = alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.92 : 0.98);
  const bottom = alpha(theme.palette.background.default, theme.palette.mode === "dark" ? 0.75 : 0.92);
  return `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`;
}
