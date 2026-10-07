import assert from "node:assert/strict";
import { Given, Then, When } from "@cucumber/cucumber";
import { formatMDTG, parseMDTG } from "../../../src/index.js";

Given("I have the UTC date {string}", function (value) {
  this.date = new Date(value);
});

Given("I have the MDTG value {string}", function (value) {
  this.value = value;
});

When("I format it as {string} MDTG in timezone {string}", function (form, timezone) {
  this.value = formatMDTG(this.date, { form, timezone });
});

When("I parse the MDTG value", function () {
  try {
    this.date = parseMDTG(this.value);
  } catch (error) {
    this.error = error;
  }
});

Then("the MDTG value should be {string}", function (expected) {
  assert.equal(this.value, expected);
});

Then("the UTC date should be {string}", function (expected) {
  assert.equal(this.date.toISOString(), expected);
});

Then("parsing should fail with a RangeError", function () {
  assert.ok(this.error instanceof RangeError);
});
