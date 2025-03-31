import { MDTG } from "./index.js";
import { strict } from "node:assert";

const dateToTest = new Date(Date.UTC(2024, 7, 12, 11, 55, 30, 0));
const mdtg = new MDTG(dateToTest);

strict("121155Z" === mdtg.toMDT({ form: "short" }));
strict("121155Zaug24" === mdtg.toMDT({ form: "shortened" }));
strict("12115530Zaug24" === mdtg.toMDT({ form: "long" }));
strict("12115530Zaug24" === mdtg.toMDT());

strict(
  MDTG.parse("12115530Zaug24").toString() ===
    new Date(Date.UTC(2024, 7, 12, 11, 55, 30, 0)).toString(),
);
strict(
  MDTG.parse("121155Zaug24").toString() ===
    new Date(Date.UTC(2024, 7, 12, 11, 55, 0, 0)).toString(),
);
strict(
  MDTG.parse("121155ZAUG24").toString() ===
    new Date(Date.UTC(2024, 7, 12, 11, 55, 0, 0)).toString(),
);
strict(
  MDTG.parse("121155Z").toString() ===
    new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        12,
        11,
        55,
        0,
        0,
      ),
    ).toString(),
);

console.log("All tests run.");
