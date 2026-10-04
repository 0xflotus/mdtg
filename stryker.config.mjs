import { defineConfig } from "@systemfsoftware/stryker-js/config";

export default defineConfig({
  testRunner: "vitest",
  plugins: ["@systemfsoftware/stryker-js-vitest-runner"],
  mutate: ["src/**/*.js", "!src/**/index.js"],
  reporters: ["html", "clear-text", "progress"],
  thresholds: {
    high: 90,
    low: 80,
    break: 80,
  },
  coverageAnalysis: "perTest",
});
