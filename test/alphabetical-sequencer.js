import { BaseSequencer } from "vitest/node";

export default class AlphabeticalSequencer extends BaseSequencer {
  async sort(files) {
    const suiteOrder = (moduleId) => {
      const path = moduleId.replaceAll("\\", "/");
      if (path.includes("/test/spec/")) return 0;
      if (path.includes("/test/integration/")) return 1;
      return 2;
    };

    return [...files].toSorted((a, b) => {
      const orderDifference = suiteOrder(a.moduleId) - suiteOrder(b.moduleId);
      if (orderDifference !== 0) return orderDifference;

      return a.moduleId.localeCompare(b.moduleId, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }
}
