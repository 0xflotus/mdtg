import { BaseSequencer } from "vitest/node";

export default class AlphabeticalSequencer extends BaseSequencer {
  async sort(files) {
    return [...files].toSorted((a, b) =>
      a.moduleId.localeCompare(b.moduleId, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );
  }
}
