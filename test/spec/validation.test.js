import { describe, expect, it } from "vitest";
import {
  isExtendedFormat,
  isMDTG,
  isShortFormat,
  isStandardFormat,
  isValidMDTG,
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

describe("MDTG semantic validation", () => {
  it.each([
    ["121155Z", true],
    ["121155Zaug24", true],
    ["12115530Zaug24", true],
    ["310224Zfeb24", false],
    ["126155Z", false],
    ["invalid", false],
  ])(
    "checks whether %s is a valid military date-time group",
    (value, expected) => {
      expect(isValidMDTG(value)).toBe(expected);
    },
  );

  it("uses the explicit reference date for short form", () => {
    const options = { referenceDate: new Date(Date.UTC(2023, 1, 1)) };

    expect(isValidMDTG("290223Z", options)).toBe(false);
    expect(
      isValidMDTG("290224Z", {
        referenceDate: new Date(Date.UTC(2024, 1, 1)),
      }),
    ).toBe(true);
  });

  it("surfaces invalid reference dates", () => {
    expect(() =>
      isValidMDTG("121155Z", {
        referenceDate: new Date("invalid"),
      }),
    ).toThrow(TypeError);
  });
});
