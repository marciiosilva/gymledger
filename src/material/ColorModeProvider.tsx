import { alpha, createTheme, type PaletteMode, type Theme } from "@mui/material/styles";
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { getGymLedgerThemeOptions } from "./theme";

const STORAGE_KEY = "gymledger-color-mode";

interface ColorModeContextValue {
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
  toggleMode: () => void;
  theme: Theme;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

function readStoredMode(): PaletteMode | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark") {
      return raw;
    }
  } catch {
    // ignore
  }
  return null;
}

function readSystemMode(): PaletteMode {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialMode(): PaletteMode {
  return readStoredMode() ?? readSystemMode();
}

function applyDocumentScheme(mode: PaletteMode) {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.style.colorScheme = mode;
  document.documentElement.setAttribute("data-gymledger-color-scheme", mode);
}

/**
 * Sincroniza tokens CSS (Tailwind/legado) com o tema MUI para evitar texto escuro em fundo escuro
 * e vice-versa quando o body usa `color: var(--color-text-primary)`.
 */
function applyGymLedgerDesignTokens(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  const { palette } = theme;
  const isDark = palette.mode === "dark";

  const paper = palette.background.paper;
  const surfaceSoft = isDark ? alpha(paper, 0.75) : alpha(palette.common.black, 0.03);
  const border = isDark ? "rgba(255,255,255,0.10)" : "rgba(17, 43, 77, 0.10)";
  const successSoft = alpha(palette.success.main, isDark ? 0.16 : 0.1);
  const warningSoft = isDark ? alpha(palette.warning.main, 0.16) : "#fce7ca";
  const dangerSoft = isDark ? alpha(palette.error.main, 0.16) : "#fde8e8";
  const infoSoft = isDark ? alpha(palette.info.main, 0.16) : "#e8f0fa";
  const scrollbarThumb = isDark ? "rgba(255,255,255,0.22)" : "rgba(31, 31, 31, 0.22)";
  const scrollbarThumbHover = isDark ? "rgba(255,255,255,0.36)" : "rgba(31, 31, 31, 0.36)";

  root.style.setProperty("--color-bg", palette.background.default);
  root.style.setProperty("--color-surface", paper);
  root.style.setProperty("--color-surface-soft", surfaceSoft);
  root.style.setProperty("--color-text-primary", palette.text.primary);
  root.style.setProperty("--color-text-muted", palette.text.secondary);
  root.style.setProperty("--color-border", border);
  root.style.setProperty("--color-success-soft", successSoft);
  root.style.setProperty("--color-warning-soft", warningSoft);
  root.style.setProperty("--color-danger-soft", dangerSoft);
  root.style.setProperty("--color-info-soft", infoSoft);
  root.style.setProperty("--gymledger-scrollbar-thumb", scrollbarThumb);
  root.style.setProperty("--gymledger-scrollbar-thumb-hover", scrollbarThumbHover);
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PaletteMode>(() => getInitialMode());

  const setMode = (next: PaletteMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    applyDocumentScheme(next);
  };

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const theme = useMemo(() => createTheme(getGymLedgerThemeOptions(mode)), [mode]);

  useEffect(() => {
    applyDocumentScheme(mode);
  }, [mode]);

  useLayoutEffect(() => {
    applyGymLedgerDesignTokens(theme);
  }, [theme]);

  const value = useMemo<ColorModeContextValue>(
    () => ({ mode, setMode, toggleMode, theme }),
    [mode, theme]
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
  const ctx = useContext(ColorModeContext);
  if (!ctx) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return ctx;
}
