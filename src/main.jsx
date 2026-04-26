import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import { DesignSystemShowcase } from "./pages/DesignSystemShowcase";
import { FinancePage } from "./pages/FinancePage";
import { StudentsPage } from "./pages/StudentsPage";
import { gymLedgerTheme } from "./material/theme";
import "./design-system/tokens/index.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={gymLedgerTheme}>
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
  </React.StrictMode>
);
