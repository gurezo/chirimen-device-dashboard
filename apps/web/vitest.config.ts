import { defineConfig } from "vitest/config";
import { join } from "path";
import angular from "@analogjs/vite-plugin-angular";

const projectRoot = __dirname;

export default defineConfig({
  root: projectRoot,
  // @ts-expect-error Vite/Rollup のバージョン差により @analogjs/vite-plugin-angular と型が不整合
  plugins: [angular()],
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
