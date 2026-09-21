import { afterEach, describe, expect, it, vi } from "vitest";
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
  afterEach(() => {
    vi.useRealTimers();
  });

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
    ["121355Y", new Date(Date.UTC(2024, 7, 13, 1, 55))],
    ["121355X", new Date(Date.UTC(2024, 7, 13, 0, 55))],
    ["121355W", new Date(Date.UTC(2024, 7, 12, 23, 55))],
    ["121355V", new Date(Date.UTC(2024, 7, 12, 22, 55))],
    ["121355U", new Date(Date.UTC(2024, 7, 12, 21, 55))],
    ["121355T", new Date(Date.UTC(2024, 7, 12, 20, 55))],
    ["121355S", new Date(Date.UTC(2024, 7, 12, 19, 55))],
    ["121355R", new Date(Date.UTC(2024, 7, 12, 18, 55))],
    ["121355Q", new Date(Date.UTC(2024, 7, 12, 17, 55))],
    ["121355P", new Date(Date.UTC(2024, 7, 12, 16, 55))],
    ["121355O", new Date(Date.UTC(2024, 7, 12, 15, 55))],
    ["121355N", new Date(Date.UTC(2024, 7, 12, 14, 55))],
    ["121355M", new Date(Date.UTC(2024, 7, 12, 0, 55))],
    ["121355B", new Date(Date.UTC(2024, 7, 12, 11, 55))],
    ["121355C", new Date(Date.UTC(2024, 7, 12, 10, 55))],
    ["121355D", new Date(Date.UTC(2024, 7, 12, 9, 55))],
    ["121355E", new Date(Date.UTC(2024, 7, 12, 8, 55))],
    ["121355F", new Date(Date.UTC(2024, 7, 12, 7, 55))],
    ["121355G", new Date(Date.UTC(2024, 7, 12, 6, 55))],
    ["121355H", new Date(Date.UTC(2024, 7, 12, 5, 55))],
    ["121355I", new Date(Date.UTC(2024, 7, 12, 4, 55))],
    ["121355J", new Date(Date.UTC(2024, 7, 12, 3, 55))],
    ["121355K", new Date(Date.UTC(2024, 7, 12, 2, 55))],
    ["121355L", new Date(Date.UTC(2024, 7, 12, 1, 55))],
    ["121355A", new Date(Date.UTC(2024, 7, 12, 12, 55))],
    ["121355Z", new Date(Date.UTC(2024, 7, 12, 13, 55))],
  ])("parses short form %s with its timezone offset", (value, expected) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2024, 7, 12)));

    expect(parse(value)).toEqual(expected);
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
