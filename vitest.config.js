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
  },
});
