import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 75,
        statements: 85
      }
    }
  }
});
