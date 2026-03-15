import { afterEach, describe, expect, it, vi } from "vitest";
import { MDTG } from "./index.js";

describe("MDTG", () => {
  describe("toMDT()", () => {
    const baseDate = new Date(Date.UTC(2024, 7, 12, 11, 55, 30, 0));
    const mdtg = new MDTG(baseDate);

    describe("short form", () => {
      it.each([
        [{ form: "short" }, "121155Z"],
        [{ form: "short", timezone: "AB" }, "121155Z"],
        [{ form: "short", timezone: "A" }, "121255A"],
        [{ form: "short", timezone: "Y" }, "112355Y"],
        [{ form: "short", timezone: "y" }, "112355Y"],
      ])("should convert %o → %s", (options, expected) => {
        expect(mdtg.toMDT(options)).toBe(expected);
      });
    });

    describe("shortened form", () => {
      it.each([
        [{ form: "shortened" }, "121155Zaug24"],
        [{ form: "shortened", timezone: "AB" }, "121155Zaug24"],
        [{ form: "shortened", timezone: "A" }, "121255Aaug24"],
        [{ form: "shortened", timezone: "Y" }, "112355Yaug24"],
        [{ form: "shortened", timezone: "y" }, "112355Yaug24"],
      ])("should convert %o → %s", (options, expected) => {
        expect(mdtg.toMDT(options)).toBe(expected);
      });
    });

    describe("long form", () => {
      it.each([
        [{ form: "long" }, "12115530Zaug24"],
        [{ form: "long", timezone: "AB" }, "12115530Zaug24"],
        [{ form: "long", timezone: "A" }, "12125530Aaug24"],
        [{ form: "long", timezone: "Y" }, "11235530Yaug24"],
        [{ form: "long", timezone: "y" }, "11235530Yaug24"],
      ])("should convert %o → %s", (options, expected) => {
        expect(mdtg.toMDT(options)).toBe(expected);
      });
    });

    it("should default to long format", () => {
      expect(mdtg.toMDT()).toBe("12115530Zaug24");
    });
  });

  describe("date boundary behaviour", () => {
    it.each([
      [
        new Date(Date.UTC(2001, 11, 31, 23, 59, 0, 0)),
        [
          [{ form: "shortened" }, "312359Zdec01"],
          [{ form: "shortened", timezone: "AB" }, "312359Zdec01"],
          [{ form: "shortened", timezone: "A" }, "010059Ajan02"],
          [{ form: "shortened", timezone: "Y" }, "311159Ydec01"],
          [{ form: "shortened", timezone: "y" }, "311159Ydec01"],
        ],
      ],
      [
        new Date(Date.UTC(2002, 0, 1, 0, 0, 0, 0)),
        [
          [{ form: "shortened" }, "010000Zjan02"],
          [{ form: "shortened", timezone: "AB" }, "010000Zjan02"],
          [{ form: "shortened", timezone: "A" }, "010100Ajan02"],
          [{ form: "shortened", timezone: "Y" }, "311200Ydec01"],
          [{ form: "shortened", timezone: "y" }, "311200Ydec01"],
        ],
      ],
    ])("should handle date %s correctly", (date, tests) => {
      const mdtg = new MDTG(date);

      tests.forEach(([options, expected]) => {
        expect(mdtg.toMDT(options)).toBe(expected);
      });
    });
  });

  describe("dynamic date", () => {
    it("should convert correctly", () => {
      const now = new Date();

      const secondThisMonth = new MDTG(
        new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            2,
            11,
            27,
            now.getUTCSeconds(),
          ),
        ),
      );

      expect(secondThisMonth.toMDT({ form: "short" })).toBe("021127Z");
    });
  });

  describe("parse()", () => {
    describe("long form", () => {
      it.each([
        ["12115530Zaug24", new Date(Date.UTC(2024, 7, 12, 11, 55, 30, 0))],
        ["12115530Aaug24", new Date(Date.UTC(2024, 7, 12, 10, 55, 30, 0))],
        ["12115530Qaug24", new Date(Date.UTC(2024, 7, 12, 15, 55, 30, 0))],
        ["12115530Yaug24", new Date(Date.UTC(2024, 7, 12, 23, 55, 30, 0))],
        ["12115530Maug24", new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0))],
        ["12115530maug24", new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0))],
        ["12115530mAUG24", new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0))],
      ])("should parse %s", (input, expected) => {
        expect(MDTG.parse(input)).toEqual(expected);
      });
    });

    describe("shortened form", () => {
      it.each([
        ["121155Zaug24", new Date(Date.UTC(2024, 7, 12, 11, 55, 0, 0))],
        ["121155ZAUG24", new Date(Date.UTC(2024, 7, 12, 11, 55, 0, 0))],
      ])("should parse %s", (input, expected) => {
        expect(MDTG.parse(input)).toEqual(expected);
      });
    });

    describe("short form", () => {
      it.each([
        ["121155Z", 11],
        ["121155Q", 15],
        ["121155A", 10],
      ])("should parse %s", (input, expectedHour) => {
        const now = new Date();

        expect(MDTG.parse(input)).toStrictEqual(
          new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              12,
              expectedHour,
              55,
              0,
              0,
            ),
          ),
        );
      });
    });
  });

  describe("parse() invalid inputs", () => {
    it.each([
      "121155",
      "abcdefg",
      "12115530Zfoo24",
      "12115530Zabc24",
      "12115530!aug24",
      "",
    ])("should throw for invalid input %s", (input) => {
      expect(() => MDTG.parse(input)).toThrow();
    });
  });

  describe("constructor validation", () => {
    it("should throw if constructor argument is not a Date", () => {
      expect(() => new MDTG("2024")).toThrow();
      expect(() => new MDTG(123)).toThrow();
      expect(() => new MDTG({})).toThrow();
    });

    it("should accept valid Date", () => {
      expect(() => new MDTG(new Date())).not.toThrow();
    });
  });

  describe("toDate()", () => {
    it("should return a Date instance", () => {
      const mdtg = new MDTG(new Date());
      expect(mdtg.toDate()).toBeInstanceOf(Date);
    });

    it("should return a copy and not mutate internal state", () => {
      const original = new Date(Date.UTC(2024, 0, 1));
      const mdtg = new MDTG(original);

      const returned = mdtg.toDate();
      returned.setUTCFullYear(2000);

      expect(mdtg.toDate().getUTCFullYear()).toBe(2024);
    });
  });

  describe("toMDT() option handling", () => {
    const baseDate = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));
    const mdtg = new MDTG(baseDate);

    it("should work with empty options", () => {
      expect(mdtg.toMDT({})).toBe("12115530Zaug24");
    });

    it("should apply timezone without form", () => {
      expect(mdtg.toMDT({ timezone: "A" })).toBe("12125530Aaug24");
    });
  });

  describe("leap year handling", () => {
    it("should correctly format Feb 29", () => {
      const date = new Date(Date.UTC(2024, 1, 29, 12, 0, 0));
      const mdtg = new MDTG(date);

      expect(mdtg.toMDT({ form: "shortened" })).toBe("291200Zfeb24");
    });
  });

  describe("month boundary behaviour", () => {
    it("should handle month rollover", () => {
      const date = new Date(Date.UTC(2024, 7, 31, 23, 30));
      const mdtg = new MDTG(date);

      expect(mdtg.toMDT({ form: "shortened", timezone: "A" })).toBe(
        "010030Asep24",
      );
    });
  });

  describe("round trip", () => {
    it("should preserve time through format and parse", () => {
      const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));
      const mdtg = new MDTG(date);

      const parsed = MDTG.parse(mdtg.toMDT());

      expect(parsed).toEqual(date);
    });
  });

  it("should throw if short MDT validation fails", () => {
    const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));
    const mdtg = new MDTG(date);

    const spy = vi.spyOn(MDTG, "isShortFormat").mockReturnValue(false);

    expect(() => mdtg.toMDT({ form: "short" })).toThrow(
      "Failed to build short MDTG",
    );

    spy.mockRestore();
  });

  it("should throw if long MDT validation fails", () => {
    const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));
    const mdtg = new MDTG(date);

    const spy = vi.spyOn(MDTG, "isLongFormat").mockReturnValue(false);

    expect(() => mdtg.toMDT({ form: "long" })).toThrow(
      "Failed to build long MDTG",
    );

    spy.mockRestore();
  });

  it("should throw if shortened MDT validation fails", () => {
    const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));
    const mdtg = new MDTG(date);

    const spy = vi.spyOn(MDTG, "isShortenedFormat").mockReturnValue(false);

    expect(() => mdtg.toMDT({ form: "shortened" })).toThrow(
      "Failed to build shortened MDTG",
    );

    spy.mockRestore();
  });

  describe("parse() branch coverage", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should use short parser when short format matches", () => {
      vi.spyOn(MDTG, "isShortFormat").mockReturnValue(true);
      vi.spyOn(MDTG, "isShortenedFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isLongFormat").mockReturnValue(false);

      const result = MDTG.parse("121155Z");

      expect(result).toBeInstanceOf(Date);
    });

    it("should use shortened parser when shortened format matches", () => {
      vi.spyOn(MDTG, "isShortFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isShortenedFormat").mockReturnValue(true);
      vi.spyOn(MDTG, "isLongFormat").mockReturnValue(false);

      const result = MDTG.parse("121155Zaug24");

      expect(result).toBeInstanceOf(Date);
    });

    it("should use long parser when long format matches", () => {
      vi.spyOn(MDTG, "isShortFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isShortenedFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isLongFormat").mockReturnValue(true);

      const result = MDTG.parse("12115530Zaug24");

      expect(result).toBeInstanceOf(Date);
    });

    it("should throw when no format matches", () => {
      vi.spyOn(MDTG, "isShortFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isShortenedFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isLongFormat").mockReturnValue(false);

      expect(() => MDTG.parse("invalid")).toThrow();
    });
  });

  describe("constructor default behaviour", () => {
    it("should use current date if none is provided", () => {
      const before = Date.now();

      const mdtg = new MDTG();

      const after = Date.now();
      const result = mdtg.toDate().getTime();

      expect(result).toBeGreaterThanOrEqual(before - 5);
      expect(result).toBeLessThanOrEqual(after + 5);
    });
  });

  describe("parse() branch coverage explicit", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call #parseShort when only shortFormat is true", () => {
      vi.spyOn(MDTG, "isShortFormat").mockReturnValue(true);
      vi.spyOn(MDTG, "isShortenedFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isLongFormat").mockReturnValue(false);

      const date = MDTG.parse("121155Z"); // valider Short
      expect(date).toBeInstanceOf(Date);
    });

    it("should call #parseShortened when only shortenedFormat is true", () => {
      vi.spyOn(MDTG, "isShortFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isShortenedFormat").mockReturnValue(true);
      vi.spyOn(MDTG, "isLongFormat").mockReturnValue(false);

      const date = MDTG.parse("121155Zaug24"); // valider Shortened
      expect(date).toBeInstanceOf(Date);
    });

    it("should call #parseLong when only longFormat is true", () => {
      vi.spyOn(MDTG, "isShortFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isShortenedFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isLongFormat").mockReturnValue(true);

      const date = MDTG.parse("12115530Zaug24"); // valider Long
      expect(date).toBeInstanceOf(Date);
    });

    it("should throw when all format checks are false", () => {
      vi.spyOn(MDTG, "isShortFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isShortenedFormat").mockReturnValue(false);
      vi.spyOn(MDTG, "isLongFormat").mockReturnValue(false);

      expect(() => MDTG.parse("invalidString")).toThrow(/Invalid MDTG string/);
    });
  });
});
