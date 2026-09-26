import { defineConfig } from "vitest/config";
import AlphabeticalSequencer from "./test/alphabetical-sequencer";

export default defineConfig({
  test: {
    include: ["**/*.test.js"],
    fileParallelism: false,
    isolate: false,
    sequence: {
      sequencer: AlphabeticalSequencer,
    },
    benchmark: {
      include: ["**/*.bench.js"],
    },
    coverage: {
      include: ["src/**/*.js"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90,
      },
    },
  },
});
