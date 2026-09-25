import { describe, test } from "vitest";
import {
  formatMDTG,
  isLongFormat,
  isMDTG,
  isShortenedFormat,
  isShortFormat,
  parseMDTG,
} from "./src/index.js";

const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));

describe("MDTG benchmarks", () => {
  test("functional formatting API", async ({ bench }) => {
    await bench("formatMDTG - short", () => {
      formatMDTG(date, { form: "short" });
    }).run();

    await bench("formatMDTG - shortened", () => {
      formatMDTG(date, { form: "shortened" });
    }).run();

    await bench("formatMDTG - long", () => {
      formatMDTG(date, { form: "long" });
    }).run();
  });

  test("parsing and validation API", async ({ bench }) => {
    await bench("parse - short", () => {
      parseMDTG("121155Z");
    }).run();

    await bench("parse - shortened", () => {
      parseMDTG("121155Zaug24");
    }).run();

    await bench("parse - long", () => {
      parseMDTG("12115530Zaug24");
    }).run();

    await bench("isShortFormat", () => {
      isShortFormat("121155Z");
    }).run();

    await bench("isShortenedFormat", () => {
      isShortenedFormat("121155Zaug24");
    }).run();

    await bench("isLongFormat", () => {
      isLongFormat("12115530Zaug24");
    }).run();

    await bench("isMDTG - short", () => {
      isMDTG("121155Z");
    }).run();

    await bench("isMDTG - shortened", () => {
      isMDTG("121155Zaug24");
    }).run();

    await bench("isMDTG - long", () => {
      isMDTG("12115530Zaug24");
    }).run();

    await bench("isMDTG - invalid", () => {
      isMDTG("invalid");
    }).run();
  });
});
