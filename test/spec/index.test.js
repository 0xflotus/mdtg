import { describe, expect, it } from "vitest";
import { formatMDTG, parseMDTG } from "../../src/index.js";

describe("round trip", () => {
  it("round trips a date", () => {
    const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));
    expect(parseMDTG(formatMDTG(date))).toEqual(date);
  });

  it("round trips deterministic dates across all timezone letters", () => {
    const dates = [
      new Date(Date.UTC(2024, 0, 15, 12, 34, 56)),
      new Date(Date.UTC(2024, 5, 15, 0, 15, 30)),
      new Date(Date.UTC(2024, 11, 15, 23, 45, 1)),
    ];
    const timezones = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (const date of dates) {
      for (const timezone of timezones) {
        const value = formatMDTG(date, { timezone });
        expect(parseMDTG(value)).toEqual(date);
      }
    }
  });

  it("round trips standard form to minute precision across date boundaries", () => {
    const dates = [
      new Date(Date.UTC(2024, 0, 1, 0, 15, 45)),
      new Date(Date.UTC(2024, 11, 31, 23, 45, 30)),
    ];
    const timezones = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (const date of dates) {
      for (const timezone of timezones) {
        const expected = new Date(date);
        expected.setUTCSeconds(0, 0);
        const value = formatMDTG(date, { form: "standard", timezone });
        expect(parseMDTG(value)).toEqual(expected);
      }
    }
  });
});
