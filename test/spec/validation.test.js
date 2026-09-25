import { describe, expect, it } from "vitest";
import {
  isLongFormat,
  isMDTGFormat,
  isShortenedFormat,
  isShortFormat,
} from "../../src/index.js";

describe("format validation", () => {
  it.each([
    ["121155Z", isShortFormat, true],
    ["121155Zaug24", isShortenedFormat, true],
    ["12115530Zaug24", isLongFormat, true],
    ["invalid", isShortFormat, false],
    ["121155Zaug24", isShortFormat, false],
    [null, isLongFormat, false],
  ])("checks %s", (value, validator, expected) => {
    expect(validator(value)).toBe(expected);
  });

  it.each([
    ["121155Z", true],
    ["121155Zaug24", true],
    ["12115530Zaug24", true],
    ["invalid", false],
    ["121155Zaug2", false],
    [null, false],
  ])("checks whether %s is an MDTG format", (value, expected) => {
    expect(isMDTGFormat(value)).toBe(expected);
  });
});
