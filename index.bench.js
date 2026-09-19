import { describe, test } from "vitest";
import { MDTG } from "./index.js";

const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));
const mdtg = new MDTG(date);

describe("MDTG benchmarks", () => {
  test("instance and formatting API", async ({ bench }) => {
    await bench("constructor", () => {
      new MDTG(date);
    }).run();

    await bench("toDate", () => {
      mdtg.toDate();
    }).run();

    await bench("toMDT - short", () => {
      mdtg.toMDT({ form: "short" });
    }).run();

    await bench("toMDT - shortened", () => {
      mdtg.toMDT({ form: "shortened" });
    }).run();

    await bench("toMDT - long", () => {
      mdtg.toMDT({ form: "long" });
    }).run();
  });

  test("parsing and validation API", async ({ bench }) => {
    await bench("parse - short", () => {
      MDTG.parse("121155Z");
    }).run();

    await bench("parse - shortened", () => {
      MDTG.parse("121155Zaug24");
    }).run();

    await bench("parse - long", () => {
      MDTG.parse("12115530Zaug24");
    }).run();

    await bench("isShortFormat", () => {
      MDTG.isShortFormat("121155Z");
    }).run();

    await bench("isShortenedFormat", () => {
      MDTG.isShortenedFormat("121155Zaug24");
    }).run();

    await bench("isLongFormat", () => {
      MDTG.isLongFormat("12115530Zaug24");
    }).run();
  });
});
