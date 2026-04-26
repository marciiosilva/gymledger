import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DesignSystemShowcase } from "./pages/DesignSystemShowcase";
import { appRoutes } from "./app/routes";
import { ColorModeProvider, useColorMode } from "./material/ColorModeProvider";
import "./design-system/tokens/index.css";
import "./styles.css";

function ThemedApp() {
  const { theme } = useColorMode();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="/ds" element={<DesignSystemShowcase />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeProvider>
      <ThemedApp />
    </ColorModeProvider>
  </React.StrictMode>
);
