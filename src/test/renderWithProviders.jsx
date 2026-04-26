import { CssBaseline, ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ColorModeProvider, useColorMode } from "../material/ColorModeProvider";

function TestThemeProvider({ children, route = "/" }) {
  const { theme } = useColorMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </ThemeProvider>
  );
}

export function renderWithProviders(ui, options = {}) {
  return render(
    <ColorModeProvider>
      <TestThemeProvider route={options.route}>{ui}</TestThemeProvider>
    </ColorModeProvider>
  );
}
