import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import { DesignSystemShowcase } from "./pages/DesignSystemShowcase";
import { FinancePage } from "./pages/FinancePage";
import { StudentsPage } from "./pages/StudentsPage";
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
          <Route path="/" element={<App />} />
          <Route path="/alunos" element={<StudentsPage />} />
          <Route path="/financeiro" element={<FinancePage />} />
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
