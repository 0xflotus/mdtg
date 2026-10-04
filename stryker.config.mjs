export default {
  testRunner: "command",
  commandRunner: {
    command: "npm test",
  },
  mutate: ["src/**/*.js", "!src/**/index.js"],
  reporters: ["html", "clear-text", "progress"],
  thresholds: {
    high: 90,
    low: 80,
    break: 80,
  },
  coverageAnalysis: "perTest",
};
