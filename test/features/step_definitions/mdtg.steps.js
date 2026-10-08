import assert from "node:assert/strict";
import { Given, Then, When } from "@cucumber/cucumber";
import { formatMDTG, isMDTG, isValidMDTG, parseMDTG } from "../../../src/index.js";

Given("I have the UTC date {string}", function (value) {
  this.date = new Date(value);
});

Given("I have the MDTG value {string}", function (value) {
  this.value = value;
});

Given("I have the reference date {string}", function (value) {
  this.referenceDate = new Date(value);
});

When("I format it as {string} MDTG in timezone {string}", function (form, timezone) {
  this.value = formatMDTG(this.date, { form, timezone });
});

When("I parse the MDTG value", function () {
  try {
    this.date = parseMDTG(this.value, { referenceDate: this.referenceDate });
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

Then("the MDTG value should be structurally valid", function () {
  assert.equal(isMDTG(this.value), true);
});

Then("the MDTG value should be semantically invalid", function () {
  assert.equal(isValidMDTG(this.value), false);
});

Then("parsing should fail with a RangeError", function () {
  assert.ok(this.error instanceof RangeError);
});
