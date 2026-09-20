import { describe, test } from "vitest";
import {
  isLongFormat,
  isShortenedFormat,
  isShortFormat,
  parse,
  toMDT,
} from "./src/index.js";

const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));

describe("MDTG benchmarks", () => {
  test("functional formatting API", async ({ bench }) => {
    await bench("toMDT - short", () => {
      toMDT(date, { form: "short" });
    }).run();

    await bench("toMDT - shortened", () => {
      toMDT(date, { form: "shortened" });
    }).run();

    await bench("toMDT - long", () => {
      toMDT(date, { form: "long" });
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
