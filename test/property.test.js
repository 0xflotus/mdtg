import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { formatMDTG, parseMDTG } from "../src/index.js";

const timezones = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const arbitraryDate = fc.date({
  min: new Date(Date.UTC(2001, 0, 2)),
  max: new Date(Date.UTC(2098, 10, 30, 23, 59, 59, 999)),
  noInvalidDate: true,
});

describe("MDTG format/parse round trips", () => {
  it("preserves the date and time to second precision in extended form", () => {
    fc.assert(
      fc.property(arbitraryDate, fc.constantFrom(...timezones), (originalDate, timezone) => {
        const expectedDate = new Date(originalDate);
        expectedDate.setUTCMilliseconds(0);

        const formatted = formatMDTG(originalDate, { timezone });
        const parsed = parseMDTG(formatted);

        expect(parsed).toEqual(expectedDate);
      }),
      { verbose: true, numRuns: 100000, interruptAfterTimeLimit: 10000, endOnFailure: true },
    );
  });

  it("preserves the date and time to minute precision in standard form", () => {
    fc.assert(
      fc.property(arbitraryDate, fc.constantFrom(...timezones), (originalDate, timezone) => {
        const expectedDate = new Date(originalDate);
        expectedDate.setUTCSeconds(0, 0);

        const formatted = formatMDTG(originalDate, {
          form: "standard",
          timezone,
        });
        const parsed = parseMDTG(formatted);

        expect(parsed).toEqual(expectedDate);
      }),
      { verbose: true, numRuns: 100000, interruptAfterTimeLimit: 10000, endOnFailure: true },
    );
  });

  it("preserves the date and time to minute precision in short form", () => {
    const shortFormDate = fc.record({
      year: fc.integer({ min: 2000, max: 2099 }),
      month: fc.integer({ min: 0, max: 11 }),
      day: fc.integer({ min: 3, max: 26 }),
      hours: fc.integer({ min: 0, max: 23 }),
      minutes: fc.integer({ min: 0, max: 59 }),
      seconds: fc.integer({ min: 0, max: 59 }),
      milliseconds: fc.integer({ min: 0, max: 999 }),
      timezone: fc.constantFrom(...timezones),
    });

    fc.assert(
      fc.property(shortFormDate, (parts) => {
        const originalDate = new Date(
          Date.UTC(
            parts.year,
            parts.month,
            parts.day,
            parts.hours,
            parts.minutes,
            parts.seconds,
            parts.milliseconds,
          ),
        );

        const expectedDate = new Date(originalDate);
        expectedDate.setUTCSeconds(0, 0);

        const formatted = formatMDTG(originalDate, {
          form: "short",
          timezone: parts.timezone,
        });

        const parsed = parseMDTG(formatted, {
          referenceDate: originalDate,
        });

        expect(parsed).toEqual(expectedDate);
      }),
      { verbose: true, numRuns: 100000, interruptAfterTimeLimit: 10000, endOnFailure: true },
    );
  });
});
