import { createTheme, type PaletteMode, type Theme } from "@mui/material/styles";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
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
