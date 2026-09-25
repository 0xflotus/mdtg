import { describe, expect, it } from "vitest";
import { formatMDTG } from "../../src/index.js";

describe("formatMDTG()", () => {
  const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));

  it.each([
    [{ form: "short" }, "121155Z"],
    [{ form: "shortened" }, "121155Zaug24"],
    [{ form: "long" }, "12115530Zaug24"],
    [{}, "12115530Zaug24"],
    [{ timezone: "A" }, "12125530Aaug24"],
    [{ form: "short", timezone: "Y" }, "112355Y"],
    [{ form: "short", timezone: "y" }, "112355Y"],
  ])("formats %o as %s", (options, expected) => {
    expect(formatMDTG(date, options)).toBe(expected);
  });

  it("uses the current date by default", () => {
    const now = new Date();
    const expected = `${String(now.getUTCDate()).padStart(2, "0")}${String(
      now.getUTCHours(),
    ).padStart(2, "0")}${String(now.getUTCMinutes()).padStart(2, "0")}Z`;

    expect(formatMDTG(undefined, { form: "short" })).toBe(expected);
  });

  it.each(["2024", 123, {}, new Date("invalid")])(
    "rejects %s as a date",
    (invalidDate) => {
      expect(() => formatMDTG(invalidDate)).toThrow(TypeError);
    },
  );
});

describe("date boundaries", () => {
  it.each([
    [
      new Date(Date.UTC(2001, 11, 31, 23, 59)),
      { form: "shortened", timezone: "A" },
      "010059Ajan02",
    ],
    [
      new Date(Date.UTC(2002, 0, 1)),
      { form: "shortened", timezone: "Y" },
      "311200Ydec01",
    ],
    [
      new Date(Date.UTC(2024, 7, 31, 23, 30)),
      { form: "shortened", timezone: "A" },
      "010030Asep24",
    ],
    [
      new Date(Date.UTC(2024, 1, 29, 12)),
      { form: "shortened" },
      "291200Zfeb24",
    ],
  ])("formats %s correctly", (date, options, expected) => {
    expect(formatMDTG(date, options)).toBe(expected);
  });
});
