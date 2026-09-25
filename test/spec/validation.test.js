import { describe, expect, it } from "vitest";
import {
  isLongFormat,
  isMDTGFormat,
  isShortenedFormat,
  isShortFormat,
} from "../../src/index.js";

describe("short format validation", () => {
  it.each([
    ["121155Z", isShortFormat, true],
    ["invalid", isShortFormat, false],
    ["121155Zaug24", isShortFormat, false],
    ["12115530Zaug24", isShortFormat, false],
    [null, isShortFormat, false],
    [[], isShortFormat, false],
    [{}, isShortFormat, false],
  ])("checks %s", (value, validator, expected) => {
    expect(validator(value)).toBe(expected);
  });
});

describe("shortened format validation", () => {
  it.each([
    ["121155Zaug24", isShortenedFormat, true],
    ["invalid", isShortenedFormat, false],
    ["121155Z", isShortenedFormat, false],
    ["12115530Zaug24", isShortenedFormat, false],
    [null, isShortenedFormat, false],
    [[], isShortenedFormat, false],
    [{}, isShortenedFormat, false],
  ])("checks %s", (value, validator, expected) => {
    expect(validator(value)).toBe(expected);
  });
});

describe("long format validation", () => {
  it.each([
    ["12115530Zaug24", isLongFormat, true],
    ["invalid", isLongFormat, false],
    ["121155Z", isLongFormat, false],
    ["121155Zaug24", isLongFormat, false],
    [null, isLongFormat, false],
    [[], isLongFormat, false],
    [{}, isLongFormat, false],
  ])("checks %s", (value, validator, expected) => {
    expect(validator(value)).toBe(expected);
  });
});

describe("MDTG format validation", () => {
  it.each([
    ["121155Z", true],
    ["121155Zaug24", true],
    ["12115530Zaug24", true],
    ["invalid", false],
    ["121155Zaug2", false],
    [null, false],
    [[], false],
    [{}, false],
  ])("checks whether %s is an MDTG format", (value, expected) => {
    expect(isMDTGFormat(value)).toBe(expected);
  });
});
