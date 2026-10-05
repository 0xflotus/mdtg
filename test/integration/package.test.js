import {
  formatMDTG,
  isExtendedFormat,
  isMDTG,
  isShortFormat,
  isStandardFormat,
  isValidMDTG,
  parseMDTG,
} from "mdtg";
import { describe, expect, it } from "vitest";

describe("installed package API", () => {
  it("exposes the documented formatting and validation API", () => {
    const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));

    expect(formatMDTG(date)).toBe("12115530Zaug24");
    expect(formatMDTG(date, { form: "short" })).toBe("121155Z");
    expect(formatMDTG(date, { form: "standard" })).toBe("121155Zaug24");
    expect(formatMDTG(date, { timezone: "A" })).toBe("12125530Aaug24");
    expect(isShortFormat("121155Z")).toBe(true);
    expect(isStandardFormat("121155Zaug24")).toBe(true);
    expect(isExtendedFormat("12115530Zaug24")).toBe(true);
    expect(isMDTG("12115530Zaug24")).toBe(true);
    expect(isValidMDTG("12115530Zaug24")).toBe(true);
    expect(isValidMDTG("310224Zfeb24")).toBe(false);
  });

  it("parses published forms and reverses timezone offsets", () => {
    expect(parseMDTG("121155Zaug24").toISOString()).toBe("2024-08-12T11:55:00.000Z");
    expect(parseMDTG("12115530Zaug24").toISOString()).toBe("2024-08-12T11:55:30.000Z");
    expect(parseMDTG("12125530Aaug24").toISOString()).toBe("2024-08-12T11:55:30.000Z");
  });

  it("uses a reference date to parse short form deterministically", () => {
    const referenceDate = new Date(Date.UTC(2024, 7, 1));

    expect(parseMDTG("121155Z", { referenceDate }).toISOString()).toBe("2024-08-12T11:55:00.000Z");
    expect(isValidMDTG("121155Z", { referenceDate })).toBe(true);
  });

  it("reports invalid dates and invalid values", () => {
    expect(() => parseMDTG("310224Zfeb24")).toThrow(RangeError);
    expect(() => parseMDTG("invalid")).toThrow(Error);
    expect(isMDTG("invalid")).toBe(false);
  });
});
