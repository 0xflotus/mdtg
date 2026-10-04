import { defineConfig } from "vitest/config";
import AlphabeticalSequencer from "./test/alphabetical-sequencer.js";

export default defineConfig({
  test: {
    include: ["**/*.test.js"],
    fileParallelism: false,
    isolate: false,
    sequence: {
      sequencer: AlphabeticalSequencer,
    },
    passWithNoTests: false,
    reporters: ["default"],
    hideSkippedTests: false,
    benchmark: {
      include: ["**/*.bench.js"],
    },
    coverage: {
      include: ["src/**/*.js"],
      exclude: ["**/*.d.ts", "**/index.js", "**/test/**"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90,
      },
    },
  },
});
