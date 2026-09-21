import { describe, test } from "vitest";
import {
  isLongFormat,
  isShortenedFormat,
  isShortFormat,
  parse,
  formatMDTG,
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
      parse("121155Z");
    }).run();

    await bench("parse - shortened", () => {
      parse("121155Zaug24");
    }).run();

    await bench("parse - long", () => {
      parse("12115530Zaug24");
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
  });
});
