import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    testTimeout: 10000,
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.claude/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "**/index.ts",
        "src/pages/DesignSystemShowcase.tsx",
        "src/main.jsx",
        "vite.config.js",
        "dist/**",
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 75,
        statements: 85
      }
    }
  }
});
