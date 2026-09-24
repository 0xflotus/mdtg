import { describe, expect, it } from "vitest";
import { FORM, formatMDTG } from "../../src/index.js";

describe("formatMDTG()", () => {
  const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));

  it.each([
    [{ form: FORM.SHORT }, "121155Z"],
    [{ form: FORM.SHORTENED }, "121155Zaug24"],
    [{ form: FORM.LONG }, "12115530Zaug24"],
    [{}, "12115530Zaug24"],
    [{ timezone: "A" }, "12125530Aaug24"],
    [{ form: FORM.SHORT, timezone: "Y" }, "112355Y"],
    [{ form: FORM.SHORT, timezone: "y" }, "112355Y"],
  ])("formats %o as %s", (options, expected) => {
    expect(formatMDTG(date, options)).toBe(expected);
  });

  it("uses the current date by default", () => {
    const now = new Date();
    const expected = `${String(now.getUTCDate()).padStart(2, "0")}${String(
      now.getUTCHours(),
    ).padStart(2, "0")}${String(now.getUTCMinutes()).padStart(2, "0")}Z`;

    expect(formatMDTG(undefined, { form: FORM.SHORT })).toBe(expected);
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
      { form: FORM.SHORTENED, timezone: "A" },
      "010059Ajan02",
    ],
    [
      new Date(Date.UTC(2002, 0, 1)),
      { form: FORM.SHORTENED, timezone: "Y" },
      "311200Ydec01",
    ],
    [
      new Date(Date.UTC(2024, 7, 31, 23, 30)),
      { form: FORM.SHORTENED, timezone: "A" },
      "010030Asep24",
    ],
    [
      new Date(Date.UTC(2024, 1, 29, 12)),
      { form: FORM.SHORTENED },
      "291200Zfeb24",
    ],
  ])("formats %s correctly", (date, options, expected) => {
    expect(formatMDTG(date, options)).toBe(expected);
  });
});
