import { describe, expect, it } from "vitest";
import { formatTemporalMDTG, parseTemporalMDTG } from "../../src/index.js";

const Temporal = globalThis.Temporal;

describe.skipIf(!Temporal)("Temporal MDTG API", () => {
  it.each(
    Temporal
      ? [
          [Temporal.PlainDate.from("2024-08-12"), {}, "12000000Zaug24"],
          [Temporal.PlainDateTime.from("2024-08-12T11:55:30"), { timezone: "A" }, "12115530Aaug24"],
          [Temporal.ZonedDateTime.from("2024-08-12T11:55:30+01:00[+01:00]"), {}, "12115530Aaug24"],
        ]
      : [],
  )("formats %s as %s", (value, options, expected) => {
    expect(formatTemporalMDTG(value, options)).toBe(expected);
  });

  it.each([
    ["short", "120000Z"],
    ["standard", "120000Zaug24"],
    ["extended", "12000000Zaug24"],
  ])("formats a PlainDate using the %s form", (form, expected) => {
    expect(formatTemporalMDTG(Temporal.PlainDate.from("2024-08-12"), { form })).toBe(expected);
  });

  it.each([
    ["121155Zaug24", "plainDate", "2024-08-12"],
    ["121155Zaug24", "plainDateTime", "2024-08-12T11:55:00"],
    ["121155Aaug24", "zonedDateTime", "2024-08-12T11:55:00+01:00[+01:00]"],
    ["12115530Aaug24", "zonedDateTime", "2024-08-12T11:55:30+01:00[+01:00]"],
  ])("parses %s to %s", (value, type, expected) => {
    expect(parseTemporalMDTG(value, { type }).toString()).toBe(expected);
  });

  it("uses a Temporal.PlainDate as the reference date for short values", () => {
    const result = parseTemporalMDTG("011200Z", {
      type: "plainDate",
      referenceDate: Temporal.PlainDate.from("2024-08-15"),
    });

    expect(result.toString()).toBe("2024-08-01");
  });

  it("rejects ZonedDateTime offsets that cannot be represented by an MDTG letter", () => {
    const value = Temporal.ZonedDateTime.from("2024-08-12T11:55:30+05:30[+05:30]");

    expect(() => formatTemporalMDTG(value)).toThrow(
      new RangeError("MDTG timezone letters only support whole-hour offsets"),
    );
  });

  it("rejects an unsupported parse result type", () => {
    expect(() => parseTemporalMDTG("121155Zaug24", { type: "instant" })).toThrow(TypeError);
  });
});
