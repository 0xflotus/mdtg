import { fileURLToPath } from "node:url";
import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { expect } from "vitest";
import {
  formatMDTG,
  formatTemporalMDTG,
  isMDTG,
  isValidMDTG,
  parseMDTG,
  parseTemporalMDTG,
} from "../../src/index.js";

const feature = await loadFeature(fileURLToPath(new URL("./mdtg.feature", import.meta.url)));

function setUtcDate(context, value) {
  return () => {
    context.date = new Date(value);
  };
}

function setValue(context, value) {
  return () => {
    context.value = value;
  };
}

function parseValue(context) {
  return () => {
    try {
      context.date = parseMDTG(context.value, { referenceDate: context.referenceDate });
    } catch (error) {
      context.error = error;
    }
  };
}

function setTemporalValue(context, type, value) {
  return () => {
    context.temporalValue = Temporal[type].from(value);
  };
}

function formatTemporalValue(context, options) {
  return () => {
    context.value = formatTemporalMDTG(context.temporalValue, options);
  };
}

function parseTemporalValue(context, type) {
  return () => {
    context.temporalValue = parseTemporalMDTG(context.value, { type });
  };
}

describeFeature(feature, ({ Scenario, ScenarioOutline }) => {
  const TemporalScenario = globalThis.Temporal ? Scenario : Scenario.skip;

  Scenario("Format an extended MDTG in UTC", ({ Given, When, Then }) => {
    const context = {};

    Given(
      'I have the UTC date "2024-08-12T11:55:30.000Z"',
      setUtcDate(context, "2024-08-12T11:55:30.000Z"),
    );
    When('I format it as "extended" MDTG in timezone "Z"', () => {
      context.value = formatMDTG(context.date, { form: "extended", timezone: "Z" });
    });
    Then('the MDTG value should be "12115530Zaug24"', () => {
      expect(context.value).toBe("12115530Zaug24");
    });
  });

  Scenario("Format and parse an MDTG in a local timezone", ({ Given, When, Then }) => {
    const context = {};

    Given(
      'I have the UTC date "2024-08-12T11:55:30.000Z"',
      setUtcDate(context, "2024-08-12T11:55:30.000Z"),
    );
    When('I format it as "standard" MDTG in timezone "A"', () => {
      context.value = formatMDTG(context.date, { form: "standard", timezone: "A" });
    });
    Then('the MDTG value should be "121255Aaug24"', () => {
      expect(context.value).toBe("121255Aaug24");
    });
    When("I parse the MDTG value", parseValue(context));
    Then('the UTC date should be "2024-08-12T11:55:00.000Z"', () => {
      expect(context.date.toISOString()).toBe("2024-08-12T11:55:00.000Z");
    });
  });

  TemporalScenario("Format and parse a Temporal PlainDate", ({ Given, When, Then }) => {
    const context = {};

    Given(
      'I have the Temporal PlainDate "2024-08-12"',
      setTemporalValue(context, "PlainDate", "2024-08-12"),
    );
    When("I format the Temporal value as an extended MDTG", formatTemporalValue(context, {}));
    Then('the MDTG value should be "12000000Zaug24"', () => {
      expect(context.value).toBe("12000000Zaug24");
    });
    When(
      "I parse the MDTG value as a Temporal PlainDate",
      parseTemporalValue(context, "plainDate"),
    );
    Then('the Temporal value should be "2024-08-12"', () => {
      expect(context.temporalValue.toString()).toBe("2024-08-12");
    });
  });

  TemporalScenario("Format and parse a Temporal PlainDateTime", ({ Given, When, Then }) => {
    const context = {};

    Given(
      'I have the Temporal PlainDateTime "2024-08-12T11:55:30"',
      setTemporalValue(context, "PlainDateTime", "2024-08-12T11:55:30"),
    );
    When(
      'I format the Temporal value as an extended MDTG in timezone "A"',
      formatTemporalValue(context, { form: "extended", timezone: "A" }),
    );
    Then('the MDTG value should be "12115530Aaug24"', () => {
      expect(context.value).toBe("12115530Aaug24");
    });
    When(
      "I parse the MDTG value as a Temporal PlainDateTime",
      parseTemporalValue(context, "plainDateTime"),
    );
    Then('the Temporal value should be "2024-08-12T11:55:30"', () => {
      expect(context.temporalValue.toString()).toBe("2024-08-12T11:55:30");
    });
  });

  TemporalScenario("Format and parse a Temporal ZonedDateTime", ({ Given, When, Then }) => {
    const context = {};
    const value = "2024-08-12T11:55:30+01:00[+01:00]";

    Given(
      `I have the Temporal ZonedDateTime "${value}"`,
      setTemporalValue(context, "ZonedDateTime", value),
    );
    When("I format the Temporal value as an extended MDTG", formatTemporalValue(context, {}));
    Then('the MDTG value should be "12115530Aaug24"', () => {
      expect(context.value).toBe("12115530Aaug24");
    });
    When(
      "I parse the MDTG value as a Temporal ZonedDateTime",
      parseTemporalValue(context, "zonedDateTime"),
    );
    Then(`the Temporal value should be "${value}"`, () => {
      expect(context.temporalValue.toString()).toBe(value);
    });
  });

  Scenario("Reject an invalid calendar date", ({ Given, When, Then }) => {
    const context = {};

    Given('I have the MDTG value "310224Zfeb24"', setValue(context, "310224Zfeb24"));
    When("I parse the MDTG value", parseValue(context));
    Then("parsing should fail with a RangeError", () => {
      expect(context.error).toBeInstanceOf(RangeError);
    });
  });

  Scenario("Format a short MDTG without month or year", ({ Given, When, Then }) => {
    const context = {};

    Given(
      'I have the UTC date "2024-08-12T11:55:30.000Z"',
      setUtcDate(context, "2024-08-12T11:55:30.000Z"),
    );
    When('I format it as "short" MDTG in timezone "Z"', () => {
      context.value = formatMDTG(context.date, { form: "short", timezone: "Z" });
    });
    Then('the MDTG value should be "121155Z"', () => {
      expect(context.value).toBe("121155Z");
    });
  });

  Scenario("Parse a short MDTG using a reference date", ({ Given, When, Then, And }) => {
    const context = {};

    Given('I have the reference date "2024-08-01T00:00:00.000Z"', () => {
      context.referenceDate = new Date("2024-08-01T00:00:00.000Z");
    });
    And('I have the MDTG value "121155Z"', setValue(context, "121155Z"));
    When("I parse the MDTG value", parseValue(context));
    Then('the UTC date should be "2024-08-12T11:55:00.000Z"', () => {
      expect(context.date.toISOString()).toBe("2024-08-12T11:55:00.000Z");
    });
  });

  ScenarioOutline(
    "Apply timezone offsets across UTC date boundaries",
    ({ Given, When, Then }, variables) => {
      const context = {};

      Given('I have the UTC date "<date>"', setUtcDate(context, variables.date));
      When('I format it as "extended" MDTG in timezone "<timezone>"', () => {
        context.value = formatMDTG(context.date, {
          form: "extended",
          timezone: variables.timezone,
        });
      });
      Then('the MDTG value should be "<value>"', () => {
        expect(context.value).toBe(variables.value);
      });
      When("I parse the MDTG value", parseValue(context));
      Then('the UTC date should be "<date>"', () => {
        expect(context.date.toISOString()).toBe(variables.date);
      });
    },
  );

  Scenario("Distinguish structural format from semantic validity", ({ Given, Then, And }) => {
    const context = {};

    Given('I have the MDTG value "310224Zfeb24"', setValue(context, "310224Zfeb24"));
    Then("the MDTG value should be structurally valid", () => {
      expect(isMDTG(context.value)).toBe(true);
    });
    And("the MDTG value should be semantically invalid", () => {
      expect(isValidMDTG(context.value)).toBe(false);
    });
  });

  ScenarioOutline("Reject invalid times", ({ Given, When, Then }, variables) => {
    const context = {};

    Given('I have the MDTG value "<value>"', setValue(context, variables.value));
    When("I parse the MDTG value", parseValue(context));
    Then("parsing should fail with a RangeError", () => {
      expect(context.error).toBeInstanceOf(RangeError);
    });
  });
});
