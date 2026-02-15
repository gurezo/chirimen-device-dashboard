import { defineConfig } from "vitest/config";
import { join } from "path";
import angular from "@analogjs/vite-plugin-angular";

const projectRoot = __dirname;

export default defineConfig({
  root: projectRoot,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Vite/Rollup version mismatch with @analogjs/vite-plugin-angular
  plugins: [angular()] as any,
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [join(projectRoot, "src/test-setup.ts")],
    include: ["src/**/*.spec.ts", "src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": join(projectRoot, "src"),
    },
  },
});
