import { afterEach, describe, expect, it, vi } from "vitest";
import { parseMDTG } from "../../src/index.js";

describe("parseMDTG()", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ["12115530Zaug24", new Date(Date.UTC(2024, 7, 12, 11, 55, 30))],
    ["12115530Aaug24", new Date(Date.UTC(2024, 7, 12, 10, 55, 30))],
    ["12115530mAUG24", new Date(Date.UTC(2024, 7, 11, 22, 55, 30))],
    ["121155Zaug24", new Date(Date.UTC(2024, 7, 12, 11, 55))],
  ])("parses %s", (value, expected) => {
    expect(parseMDTG(value)).toEqual(expected);
  });

  it("parses short form using the current month and year", () => {
    const now = new Date();
    expect(parseMDTG("121155Z")).toEqual(
      new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 12, 11, 55)),
    );
  });

  it.each([
    ["121355M", new Date(Date.UTC(2024, 7, 12, 0, 55))],
    ["121355L", new Date(Date.UTC(2024, 7, 12, 1, 55))],
    ["121355K", new Date(Date.UTC(2024, 7, 12, 2, 55))],
    ["121355J", new Date(Date.UTC(2024, 7, 12, 3, 55))],
    ["121355I", new Date(Date.UTC(2024, 7, 12, 4, 55))],
    ["121355H", new Date(Date.UTC(2024, 7, 12, 5, 55))],
    ["121355G", new Date(Date.UTC(2024, 7, 12, 6, 55))],
    ["121355F", new Date(Date.UTC(2024, 7, 12, 7, 55))],
    ["121355E", new Date(Date.UTC(2024, 7, 12, 8, 55))],
    ["121355D", new Date(Date.UTC(2024, 7, 12, 9, 55))],
    ["121355C", new Date(Date.UTC(2024, 7, 12, 10, 55))],
    ["121355B", new Date(Date.UTC(2024, 7, 12, 11, 55))],
    ["121355A", new Date(Date.UTC(2024, 7, 12, 12, 55))],
    ["121355Z", new Date(Date.UTC(2024, 7, 12, 13, 55))],
    ["121355N", new Date(Date.UTC(2024, 7, 12, 14, 55))],
    ["121355O", new Date(Date.UTC(2024, 7, 12, 15, 55))],
    ["121355P", new Date(Date.UTC(2024, 7, 12, 16, 55))],
    ["121355Q", new Date(Date.UTC(2024, 7, 12, 17, 55))],
    ["121355R", new Date(Date.UTC(2024, 7, 12, 18, 55))],
    ["121355S", new Date(Date.UTC(2024, 7, 12, 19, 55))],
    ["121355T", new Date(Date.UTC(2024, 7, 12, 20, 55))],
    ["121355U", new Date(Date.UTC(2024, 7, 12, 21, 55))],
    ["121355V", new Date(Date.UTC(2024, 7, 12, 22, 55))],
    ["121355W", new Date(Date.UTC(2024, 7, 12, 23, 55))],
    ["121355X", new Date(Date.UTC(2024, 7, 13, 0, 55))],
    ["121355Y", new Date(Date.UTC(2024, 7, 13, 1, 55))],
  ])("parses short form %s with its timezone offset", (value, expected) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2024, 7, 12)));

    expect(parseMDTG(value)).toEqual(expected);
  });

  it.each(["121155", "abcdefg", "12115530Zfoo24", "12115530!aug24", ""])(
    "rejects invalid input %s",
    (value) => {
      expect(() => parseMDTG(value)).toThrow();
    },
  );

  it.each(["290223Zfeb23", "310424Zapr24", "121560Z", "12115560Zfeb24"])(
    "rejects invalid calendar or time input %s",
    (value) => {
      expect(() => parseMDTG(value)).toThrow(RangeError);
    },
  );
});
