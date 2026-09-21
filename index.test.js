import { describe, expect, it, vi } from "vitest";
import {
  FORM,
  formatMDTG,
  isLongFormat,
  isShortenedFormat,
  isShortFormat,
  parse,
} from "./src/index.js";

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
});

describe("parse()", () => {
  it.each([
    ["12115530Zaug24", new Date(Date.UTC(2024, 7, 12, 11, 55, 30))],
    ["12115530Aaug24", new Date(Date.UTC(2024, 7, 12, 10, 55, 30))],
    ["12115530mAUG24", new Date(Date.UTC(2024, 7, 11, 22, 55, 30))],
    ["121155Zaug24", new Date(Date.UTC(2024, 7, 12, 11, 55))],
  ])("parses %s", (value, expected) => {
    expect(parse(value)).toEqual(expected);
  });

  it("parses short form using the current month and year", () => {
    const now = new Date();
    expect(parse("121155Z")).toEqual(
      new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 12, 11, 55)),
    );
  });

  it.each([
    ["121355M", new Date(Date.UTC(2024, 7, 12, 0, 55))],
    ["121355A", new Date(Date.UTC(2024, 7, 12, 12, 55))],
    ["121355Z", new Date(Date.UTC(2024, 7, 12, 13, 55))],
  ])("parses short form %s with its timezone offset", (value, expected) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2024, 7, 12)));

    try {
      expect(parse(value)).toEqual(expected);
    } finally {
      vi.useRealTimers();
    }
  });

  it.each(["121155", "abcdefg", "12115530Zfoo24", "12115530!aug24", ""])(
    "rejects invalid input %s",
    (value) => {
      expect(() => parse(value)).toThrow();
    },
  );

  it.each(["290223Zfeb23", "310424Zapr24", "121560Z", "12115560Zfeb24"])(
    "rejects invalid calendar or time input %s",
    (value) => {
      expect(() => parse(value)).toThrow(RangeError);
    },
  );
});

it("round trips a date", () => {
  const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));
  expect(parse(formatMDTG(date))).toEqual(date);
});
