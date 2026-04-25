import { createTheme } from "@mui/material/styles";

export const gymLedgerTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e8e3e",
      dark: "#146c2e",
      light: "#66bb6a",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#0b57d0",
      dark: "#0842a0",
      light: "#a8c7fa",
      contrastText: "#ffffff"
    },
    warning: {
      main: "#b06000"
    },
    error: {
      main: "#b3261e"
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff"
    },
    text: {
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
        root: {
          border: "1px solid rgba(31,31,31,0.08)",
          boxShadow: "0 1px 2px rgba(31,31,31,0.08), 0 8px 24px rgba(31,31,31,0.06)"
        }
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
});
