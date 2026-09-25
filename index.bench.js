import { describe, test } from "vitest";
import {
  formatMDTG,
  isExtendedFormat,
  isMDTG,
  isShortFormat,
  isStandardFormat,
  parseMDTG,
} from "./src/index.js";

const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));

describe("MDTG benchmarks", () => {
  test("functional formatting API", async ({ bench }) => {
    await bench("formatMDTG - short", () => {
      formatMDTG(date, { form: "short" });
    }).run();

    await bench("formatMDTG - standard", () => {
      formatMDTG(date, { form: "standard" });
    }).run();

    await bench("formatMDTG - extended", () => {
      formatMDTG(date, { form: "extended" });
    }).run();
  });

  test("parsing and validation API", async ({ bench }) => {
    await bench("parse - short", () => {
      parseMDTG("121155Z");
    }).run();

    await bench("parse - standard", () => {
      parseMDTG("121155Zaug24");
    }).run();

    await bench("parse - extended", () => {
      parseMDTG("12115530Zaug24");
    }).run();

    await bench("isShortFormat", () => {
      isShortFormat("121155Z");
    }).run();

    await bench("isStandardFormat", () => {
      isStandardFormat("121155Zaug24");
    }).run();

    await bench("isExtendedFormat", () => {
      isExtendedFormat("12115530Zaug24");
    }).run();

    await bench("isMDTG - short", () => {
      isMDTG("121155Z");
    }).run();

    await bench("isMDTG - standard", () => {
      isMDTG("121155Zaug24");
    }).run();

    await bench("isMDTG - extended", () => {
      isMDTG("12115530Zaug24");
    }).run();

    await bench("isMDTG - invalid", () => {
      isMDTG("invalid");
    }).run();
  });
});
