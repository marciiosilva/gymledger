import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import { DesignSystemShowcase } from "./pages/DesignSystemShowcase";
import "./design-system/tokens/index.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ds" element={<DesignSystemShowcase />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
