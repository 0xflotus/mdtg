import { describe, test } from "vitest";
import {
  formatMDTG,
  isLongFormat,
  isMDTGFormat,
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

    await bench("isMDTGFormat - short", () => {
      isMDTGFormat("121155Z");
    }).run();

    await bench("isMDTGFormat - shortened", () => {
      isMDTGFormat("121155Zaug24");
    }).run();

    await bench("isMDTGFormat - long", () => {
      isMDTGFormat("12115530Zaug24");
    }).run();

    await bench("isMDTGFormat - invalid", () => {
      isMDTGFormat("invalid");
    }).run();
  });
});
