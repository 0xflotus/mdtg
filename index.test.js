import { describe, expect, it } from "vitest";
import { MDTG } from "./index.js";

describe("MDTG → toMDT()", () => {
  const baseDate = new Date(Date.UTC(2024, 7, 12, 11, 55, 30, 0));
  const mdtg = new MDTG(baseDate);

  describe("short form", () => {
    it("converts correctly with default timezone", () => {
      expect(mdtg.toMDT({ form: "short" })).toBe("121155Z");
    });

    it("ignores invalid timezone length", () => {
      expect(mdtg.toMDT({ form: "short", timezone: "AB" })).toBe("121155Z");
    });

    it("converts positive timezone offsets", () => {
      expect(mdtg.toMDT({ form: "short", timezone: "A" })).toBe("121255A");
    });

    it("converts negative timezone offsets", () => {
      expect(mdtg.toMDT({ form: "short", timezone: "Y" })).toBe("112355Y");
      expect(mdtg.toMDT({ form: "short", timezone: "y" })).toBe("112355Y");
    });
  });

  describe("shortened form", () => {
    it("converts correctly with default timezone", () => {
      expect(mdtg.toMDT({ form: "shortened" })).toBe("121155Zaug24");
    });

    it("handles timezone offsets", () => {
      expect(mdtg.toMDT({ form: "shortened", timezone: "AB" })).toBe(
        "121155Zaug24",
      );

      expect(mdtg.toMDT({ form: "shortened", timezone: "A" })).toBe(
        "121255Aaug24",
      );

      expect(mdtg.toMDT({ form: "shortened", timezone: "Y" })).toBe(
        "112355Yaug24",
      );

      expect(mdtg.toMDT({ form: "shortened", timezone: "y" })).toBe(
        "112355Yaug24",
      );
    });
  });

  describe("long form", () => {
    it("converts correctly with default timezone", () => {
      expect(mdtg.toMDT({ form: "long" })).toBe("12115530Zaug24");
    });

    it("handles timezone offsets", () => {
      expect(mdtg.toMDT({ form: "long", timezone: "AB" })).toBe("12115530Zaug24");

      expect(mdtg.toMDT({ form: "long", timezone: "A" })).toBe("12125530Aaug24");

      expect(mdtg.toMDT({ form: "long", timezone: "Y" })).toBe("11235530Yaug24");

      expect(mdtg.toMDT({ form: "long", timezone: "y" })).toBe("11235530Yaug24");
    });
  });

  describe("default behaviour", () => {
    it("defaults to long format", () => {
      expect(mdtg.toMDT()).toBe("12115530Zaug24");
    });
  });
});

describe("MDTG → date boundary behaviour", () => {
  describe("31 Dec 2001 23:59", () => {
    const silvester2001 = new MDTG(
      new Date(Date.UTC(2001, 11, 31, 23, 59, 0, 0)),
    );

    it("handles timezone rollovers", () => {
      expect(silvester2001.toMDT({ form: "shortened" })).toBe("312359Zdec01");

      expect(silvester2001.toMDT({ form: "shortened", timezone: "AB" })).toBe(
        "312359Zdec01",
      );

      expect(silvester2001.toMDT({ form: "shortened", timezone: "A" })).toBe(
        "010059Ajan02",
      );

      expect(silvester2001.toMDT({ form: "shortened", timezone: "Y" })).toBe(
        "311159Ydec01",
      );

      expect(silvester2001.toMDT({ form: "shortened", timezone: "y" })).toBe(
        "311159Ydec01",
      );
    });
  });

  describe("1 Jan 2002 00:00", () => {
    const newYear2002 = new MDTG(new Date(Date.UTC(2002, 0, 1, 0, 0, 0, 0)));

    it("handles backwards timezone rollovers", () => {
      expect(newYear2002.toMDT({ form: "shortened" })).toBe("010000Zjan02");

      expect(newYear2002.toMDT({ form: "shortened", timezone: "AB" })).toBe(
        "010000Zjan02",
      );

      expect(newYear2002.toMDT({ form: "shortened", timezone: "A" })).toBe(
        "010100Ajan02",
      );

      expect(newYear2002.toMDT({ form: "shortened", timezone: "Y" })).toBe(
        "311200Ydec01",
      );

      expect(newYear2002.toMDT({ form: "shortened", timezone: "y" })).toBe(
        "311200Ydec01",
      );
    });
  });
});

describe("MDTG → dynamic date handling", () => {
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

  it("converts dynamic dates correctly", () => {
    expect(secondThisMonth.toMDT({ form: "short" })).toBe("021127Z");
  });
});

describe("MDTG.parse()", () => {
  describe("long form", () => {
    it("parses correctly", () => {
      expect(MDTG.parse("12115530Zaug24")).toEqual(
        new Date(Date.UTC(2024, 7, 12, 11, 55, 30, 0)),
      );

      expect(MDTG.parse("12115530Aaug24")).toEqual(
        new Date(Date.UTC(2024, 7, 12, 10, 55, 30, 0)),
      );

      expect(MDTG.parse("12115530Qaug24")).toEqual(
        new Date(Date.UTC(2024, 7, 12, 15, 55, 30, 0)),
      );

      expect(MDTG.parse("12115530Yaug24")).toEqual(
        new Date(Date.UTC(2024, 7, 12, 23, 55, 30, 0)),
      );

      expect(MDTG.parse("12115530Maug24")).toEqual(
        new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0)),
      );
    });

    it("is case insensitive", () => {
      expect(MDTG.parse("12115530maug24")).toEqual(
        new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0)),
      );

      expect(MDTG.parse("12115530mAUG24")).toEqual(
        new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0)),
      );
    });
  });

  describe("shortened form", () => {
    it("parses correctly", () => {
      expect(MDTG.parse("121155Zaug24")).toEqual(
        new Date(Date.UTC(2024, 7, 12, 11, 55, 0, 0)),
      );

      expect(MDTG.parse("121155ZAUG24")).toEqual(
        new Date(Date.UTC(2024, 7, 12, 11, 55, 0, 0)),
      );
    });
  });

  describe("short form", () => {
    it("uses current month and year", () => {
      const now = new Date();

      expect(MDTG.parse("121155Z")).toStrictEqual(
        new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 12, 11, 55, 0, 0),
        ),
      );

      expect(MDTG.parse("121155Q")).toStrictEqual(
        new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 12, 15, 55, 0, 0),
        ),
      );

      expect(MDTG.parse("121155A")).toStrictEqual(
        new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 12, 10, 55, 0, 0),
        ),
      );
    });
  });
});