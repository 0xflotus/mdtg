export default {
  testRunner: "vitest",
  mutate: ["src/**/*.js"],
  reporters: ["html", "clear-text", "progress"],
  thresholds: {
    high: 80,
    low: 60,
    break: 60,
  },
  coverageAnalysis: "perTest",
};
