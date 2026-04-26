import { createTheme, type PaletteMode, type ThemeOptions } from "@mui/material/styles";

export function getGymLedgerThemeOptions(mode: PaletteMode): ThemeOptions {
  const isDark = mode === "dark";

  return {
    palette: {
      mode,
      primary: {
        main: isDark ? "#4caf50" : "#1e8e3e",
        dark: isDark ? "#2e7d32" : "#146c2e",
        light: isDark ? "#81c995" : "#66bb6a",
        contrastText: "#ffffff"
      },
      secondary: {
        main: isDark ? "#7ab6ff" : "#0b57d0",
        dark: isDark ? "#4d8dff" : "#0842a0",
        light: isDark ? "#a8c7fa" : "#a8c7fa",
        contrastText: isDark ? "#0b0f0d" : "#ffffff"
      },
      warning: {
        main: isDark ? "#ffbf47" : "#b06000"
      },
      error: {
        main: isDark ? "#f2b8b5" : "#b3261e"
      },
      background: isDark
        ? {
            default: "#0b0f0d",
            paper: "#121a16"
          }
        : {
            default: "#f8fafc",
            paper: "#ffffff"
          },
      text: isDark
        ? {
            primary: "#e8eaed",
            secondary: "#b0b8c1"
          }
        : {
            primary: "#1f1f1f",
            secondary: "#5f6368"
          }
    },
    shape: {
      borderRadius: 18
    },
    typography: {
      fontFamily: "'Roboto', 'Arial', sans-serif",
      h1: {
        fontSize: "clamp(2.25rem, 4vw, 4rem)",
        lineHeight: 1,
        fontWeight: 700,
        letterSpacing: 0
      },
      h2: {
        fontSize: "1.75rem",
        lineHeight: 1.12,
        fontWeight: 700,
        letterSpacing: 0
      },
      h3: {
        fontSize: "1.25rem",
        lineHeight: 1.2,
        fontWeight: 700,
        letterSpacing: 0
      },
      button: {
        textTransform: "none",
        fontWeight: 700
      }
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true
        },
        styleOverrides: {
          root: {
            borderRadius: 999
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(31,31,31,0.08)"}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 1px 2px rgba(0,0,0,0.40), 0 10px 30px rgba(0,0,0,0.28)"
                : "0 1px 2px rgba(31,31,31,0.08), 0 8px 24px rgba(31,31,31,0.06)"
          })
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 700
          }
        }
      }
    }
  };
}

export const gymLedgerTheme = createTheme(getGymLedgerThemeOptions("light"));
