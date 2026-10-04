export default {
  testRunner: "command",
  commandRunner: {
    command: "npm test",
  },
  mutate: ["src/**/*.js", "!src/**/index.js"],
  reporters: ["html", "clear-text", "progress"],
  thresholds: {
    high: 80,
    low: 60,
    break: 60,
  },
  coverageAnalysis: "perTest",
};
