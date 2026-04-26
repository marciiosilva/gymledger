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
      borderRadius: 12
    },
    typography: {
      fontFamily: "var(--font-body), 'Segoe UI', sans-serif",
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
      overline: {
        letterSpacing: 0,
        lineHeight: 1.2,
        fontWeight: 800
      },
      button: {
        textTransform: "none",
        fontWeight: 700
      }
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: ({ ownerState }) =>
            ownerState.variant === "overline"
              ? {
                  minWidth: 0,
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }
              : {
                  minWidth: 0
                }
        }
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true
        },
        styleOverrides: {
          root: {
            maxWidth: "100%",
            minWidth: 0,
            borderRadius: 6,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          },
          startIcon: {
            flexShrink: 0
          },
          endIcon: {
            flexShrink: 0
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            minWidth: 0,
            borderRadius: 6,
            border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(31,31,31,0.08)"}`,
            boxShadow: "none"
          })
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            maxWidth: "100%",
            minWidth: 0,
            borderRadius: 6,
            fontWeight: 700
          },
          label: {
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        }
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            minWidth: 0,
            padding: 16,
            "&:last-child": {
              paddingBottom: 16
            }
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            whiteSpace: "nowrap"
          },
          head: {
            fontWeight: 800
          }
        }
      }
    }
  };
}

export const gymLedgerTheme = createTheme(getGymLedgerThemeOptions("light"));
