import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Vitest does not read tsconfig paths; map the "@/" alias used by the source.
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"]
  }
});
