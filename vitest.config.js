import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.js"],
    benchmark: {
      include: ["**/*.bench.js"],
    },
  },
});
