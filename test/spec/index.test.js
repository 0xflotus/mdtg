import { describe, expect, it } from "vitest";
import { formatMDTG, parse } from "../../src/index.js";

describe("round trip", () => {
  it("round trips a date", () => {
    const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));
    expect(parse(formatMDTG(date))).toEqual(date);
  });
});
