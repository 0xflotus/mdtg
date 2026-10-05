import { defineConfig } from "vitest/config";
import AlphabeticalSequencer from "./test/alphabetical-sequencer.js";

export default defineConfig({
  test: {
    fileParallelism: false,
    isolate: false,
    passWithNoTests: false,
    reporters: ["verbose"],
    slowTestThreshold: 2_000,
    hideSkippedTests: false,
    sequence: {
      sequencer: AlphabeticalSequencer,
    },
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
    projects: [
      {
        test: {
          name: "tests",
          include: ["test/**/*.test.js"],
          exclude: ["test/property.test.js"],
          sequence: {
            groupOrder: 0,
          },
        },
      },
      {
        test: {
          name: "property",
          include: ["test/property.test.js"],
          sequence: {
            groupOrder: 1,
          },
          testTimeout: 20_000,
        },
      },
    ],
  },
});
