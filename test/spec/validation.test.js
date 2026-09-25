import { describe, expect, it } from "vitest";
import {
  isExtendedFormat,
  isMDTG,
  isShortFormat,
  isStandardFormat,
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

describe("standard format validation", () => {
  it.each([
    ["121155Zaug24", isStandardFormat, true],
    ["invalid", isStandardFormat, false],
    ["121155Z", isStandardFormat, false],
    ["12115530Zaug24", isStandardFormat, false],
    [null, isStandardFormat, false],
    [[], isStandardFormat, false],
    [{}, isStandardFormat, false],
  ])("checks %s", (value, validator, expected) => {
    expect(validator(value)).toBe(expected);
  });
});

describe("extended format validation", () => {
  it.each([
    ["12115530Zaug24", isExtendedFormat, true],
    ["invalid", isExtendedFormat, false],
    ["121155Z", isExtendedFormat, false],
    ["121155Zaug24", isExtendedFormat, false],
    [null, isExtendedFormat, false],
    [[], isExtendedFormat, false],
    [{}, isExtendedFormat, false],
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
    expect(isMDTG(value)).toBe(expected);
  });
});
