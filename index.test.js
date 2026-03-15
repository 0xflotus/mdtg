import { describe, expect, it } from "vitest";
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
});
