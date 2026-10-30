import { describe, expect, it } from "vitest";
import { formatMDTG, isValidMDTG, parseMDTG } from "../../src/index.js";

describe("parseMDTG", () => {
  it("parses the short format relative to a fixed reference date", () => {
    const result = parseMDTG("151230Z", {
      referenceDate: new Date("2024-05-01T00:00:00.000Z"),
    });

    expect(result.toISOString()).toBe("2024-05-15T12:30:00.000Z");
  });

  it("parses the standard format with month and year", () => {
    const result = parseMDTG("151230ZMay24");

    expect(result.toISOString()).toBe("2024-05-15T12:30:00.000Z");
  });

  it("parses the extended format, including seconds", () => {
    const result = parseMDTG("15123045ZMay24");

    expect(result.toISOString()).toBe("2024-05-15T12:30:45.000Z");
  });

  it("interprets two-digit years as years from 2000 to 2099", () => {
    expect(parseMDTG("010000ZJan00").toISOString()).toBe("2000-01-01T00:00:00.000Z");
    expect(parseMDTG("010000ZJan99").toISOString()).toBe("2099-01-01T00:00:00.000Z");
  });

  it("applies the offset for the specified timezone", () => {
    // Alpha is UTC+1, so 12:30 local time is 11:30 UTC.
    expect(parseMDTG("151230AMay24").toISOString()).toBe("2024-05-15T11:30:00.000Z");
  });

  it.each([
    "310000ZFeb24", // Invalid day in February
    "012460ZMay24", // Invalid minute
    "012400ZMay24", // Invalid hour
    "010000ZFoo24", // Unknown month
    "010000ZJan", // Incomplete input
  ])("rejects invalid DTG input: %s", (value) => {
    expect(() => parseMDTG(value)).toThrow();
  });

  it("handles February 29 correctly in leap and non-leap years", () => {
    expect(parseMDTG("290000ZFeb24").toISOString()).toBe("2024-02-29T00:00:00.000Z");

    expect(() => parseMDTG("290000ZFeb23")).toThrow();
  });
});

describe("formatMDTG", () => {
  const date = new Date("2024-05-15T12:30:45.000Z");

  it("formats the short form", () => {
    expect(formatMDTG(date, { form: "short", timezone: "Z" })).toBe("151230Z");
  });

  it("formats the standard form", () => {
  expect(formatMDTG(date, { form: "standard", timezone: "Z" })).toBe(
    "151230Zmay24",
  );
});

it("defaults to the extended form", () => {
  expect(formatMDTG(date, { timezone: "Z" })).toBe("15123045Zmay24");
});


  it("formats the time for the specified timezone", () => {
    // Alpha is UTC+1, so the local DTG time is one hour later.
    expect(formatMDTG(date, { form: "short", timezone: "A" })).toBe("151330A");
  });

  it("rejects invalid Date objects", () => {
    expect(() => formatMDTG(new Date(Number.NaN))).toThrow();
  });
});

describe("isValidMDTG", () => {
  it("returns true for a valid DTG", () => {
    expect(isValidMDTG("151230ZMay24")).toBe(true);
  });

  it("returns false for a correctly shaped but impossible date", () => {
    expect(isValidMDTG("310000ZFeb24")).toBe(false);
  });

  it("returns false for an invalid format", () => {
    expect(isValidMDTG("not a DTG")).toBe(false);
  });
});
