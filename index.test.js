import { MDTG } from "./index.js";
import { it, describe, expect } from "vitest";

describe("MDTG Tests with Date of 12th August 2024 11:55:30", () => {
  const dateToTest = new Date(Date.UTC(2024, 7, 12, 11, 55, 30, 0));
  const mdtg = new MDTG(dateToTest);

  it("should convert to short MDT correctly", () => {
    expect(mdtg.toMDT({ form: "short" })).toBe("121155Z");

    expect(mdtg.toMDT({ form: "short", timezone: "AB" })).toBe("121155Z");

    expect(mdtg.toMDT({ form: "short", timezone: "A" })).toBe("121255A");

    expect(mdtg.toMDT({ form: "short", timezone: "Y" })).toBe("112355Y");

    expect(mdtg.toMDT({ form: "short", timezone: "y" })).toBe("112355Y");
  });

  it("should convert to shortened MDT correctly", () => {
    expect(mdtg.toMDT({ form: "shortened" })).toBe("121155Zaug24");

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

  it("should convert to long MDT correctly", () => {
    expect(mdtg.toMDT({ form: "long" })).toBe("12115530Zaug24");

    expect(mdtg.toMDT({ form: "long", timezone: "AB" })).toBe("12115530Zaug24");

    expect(mdtg.toMDT({ form: "long", timezone: "A" })).toBe("12125530Aaug24");

    expect(mdtg.toMDT({ form: "long", timezone: "Y" })).toBe("11235530Yaug24");

    expect(mdtg.toMDT({ form: "long", timezone: "y" })).toBe("11235530Yaug24");
  });

  it("should default convert to long MDT correctly", () => {
    expect(mdtg.toMDT()).toBe("12115530Zaug24");
  });
});

describe("MDTG Tests with Date of 31st December 2001 23:59:30", () => {
  const silvester2001 = new MDTG(
    new Date(Date.UTC(2001, 11, 31, 23, 59, 0, 0)),
  );

  it("should convert to shortened MDT correctly", () => {
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

describe("MDTG Tests with Date of 1st January 2002 00:00:00", () => {
  const newYear2002 = new MDTG(new Date(Date.UTC(2002, 0, 1, 0, 0, 0, 0)));

  it("should convert to shortened MDT correctly", () => {
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

describe("MTDG Converting Tests with the 2nd of this month", () => {
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

  it("should convert to short MDT correctly", () => {
    expect(secondThisMonth.toMDT({ form: "short" })).toBe("021127Z");
  });
});

describe("MDTG Parsing Tests", () => {
  it("should parse long form and get the right date", () => {
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

    expect(MDTG.parse("12115530maug24")).toEqual(
      new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0)),
    );

    expect(MDTG.parse("12115530mAUG24")).toEqual(
      new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0)),
    );
  });

  it("should parse shortened form and get the right date", () => {
    expect(MDTG.parse("121155Zaug24")).toEqual(
      new Date(Date.UTC(2024, 7, 12, 11, 55, 0, 0)),
    );

    expect(MDTG.parse("121155ZAUG24")).toEqual(
      new Date(Date.UTC(2024, 7, 12, 11, 55, 0, 0)),
    );
  });

  it("should parse short form and get the right date", () => {
    expect(MDTG.parse("121155Z").toString()).toBe(
      new Date(
        Date.UTC(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          12,
          11,
          55,
          0,
          0,
        ),
      ).toString(),
    );

    expect(MDTG.parse("121155Q").toString()).toBe(
      new Date(
        Date.UTC(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          12,
          15,
          55,
          0,
          0,
        ),
      ).toString(),
    );

    expect(MDTG.parse("121155A").toString()).toBe(
      new Date(
        Date.UTC(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          12,
          10,
          55,
          0,
          0,
        ),
      ).toString(),
    );
  });
});
