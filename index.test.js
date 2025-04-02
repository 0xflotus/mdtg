import { MDTG } from "./index.js";
import { strict } from "node:assert";

const dateToTest = new Date(Date.UTC(2024, 7, 12, 11, 55, 30, 0));
const mdtg = new MDTG(dateToTest);

strict("121155Z" === mdtg.toMDT({ form: "short" }));
strict("121155Z" === mdtg.toMDT({ form: "short", timezone: "AB" }));
strict("121255A" === mdtg.toMDT({ form: "short", timezone: "A" }));
strict("112355Y" === mdtg.toMDT({ form: "short", timezone: "Y" }));
strict("112355Y" === mdtg.toMDT({ form: "short", timezone: "y" }));
strict("121155Zaug24" === mdtg.toMDT({ form: "shortened" }));
strict("121155Zaug24" === mdtg.toMDT({ form: "shortened", timezone: "AB" }));
strict("121255Aaug24" === mdtg.toMDT({ form: "shortened", timezone: "A" }));
strict("112355Yaug24" === mdtg.toMDT({ form: "shortened", timezone: "Y" }));
strict("112355Yaug24" === mdtg.toMDT({ form: "shortened", timezone: "y" }));
strict("12115530Zaug24" === mdtg.toMDT({ form: "long" }));
strict("12115530Zaug24" === mdtg.toMDT({ form: "long", timezone: "AB" }));
strict("12125530Aaug24" === mdtg.toMDT({ form: "long", timezone: "A" }));
strict("11235530Yaug24" === mdtg.toMDT({ form: "long", timezone: "Y" }));
strict("11235530Yaug24" === mdtg.toMDT({ form: "long", timezone: "y" }));
strict("12115530Zaug24" === mdtg.toMDT());

const silvester2001 = new MDTG(new Date(Date.UTC(2001, 11, 31, 23, 59, 0, 0)));
strict("312359Zdec01" === silvester2001.toMDT({ form: "shortened" }));
strict(
  "312359Zdec01" === silvester2001.toMDT({ form: "shortened", timezone: "AB" }),
);
strict(
  "010059Ajan02" === silvester2001.toMDT({ form: "shortened", timezone: "A" }),
);
strict(
  "311159Ydec01" === silvester2001.toMDT({ form: "shortened", timezone: "Y" }),
);
strict(
  "311159Ydec01" === silvester2001.toMDT({ form: "shortened", timezone: "y" }),
);

const newYear2002 = new MDTG(new Date(Date.UTC(2002, 0, 1, 0, 0, 0, 0)));
strict("010000Zjan02" === newYear2002.toMDT({ form: "shortened" }));
strict(
  "010000Zjan02" === newYear2002.toMDT({ form: "shortened", timezone: "AB" }),
);
strict(
  "010100Ajan02" === newYear2002.toMDT({ form: "shortened", timezone: "A" }),
);
strict(
  "311200Ydec01" === newYear2002.toMDT({ form: "shortened", timezone: "Y" }),
);
strict(
  "311200Ydec01" === newYear2002.toMDT({ form: "shortened", timezone: "y" }),
);

const now = new Date();
const secondThisMonth = new MDTG(
  new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      2,
      11,
      27,
      now.getUTCSeconds(),
    ),
  ),
);
strict("021127Z" === secondThisMonth.toMDT({ form: "short" }));

strict(
  MDTG.parse("12115530Zaug24").toString() ===
    new Date(Date.UTC(2024, 7, 12, 11, 55, 30, 0)).toString(),
);
strict(
  MDTG.parse("12115530Aaug24").toString() ===
    new Date(Date.UTC(2024, 7, 12, 10, 55, 30, 0)).toString(),
);
strict(
  MDTG.parse("12115530Qaug24").toString() ===
    new Date(Date.UTC(2024, 7, 12, 15, 55, 30, 0)).toString(),
);
strict(
  MDTG.parse("12115530Yaug24").toString() ===
    new Date(Date.UTC(2024, 7, 12, 23, 55, 30, 0)).toString(),
);
strict(
  MDTG.parse("12115530Maug24").toString() ===
    new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0)).toString(),
);
strict(
  MDTG.parse("12115530maug24").toString() ===
    new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0)).toString(),
);
strict(
  MDTG.parse("12115530mAUG24").toString() ===
    new Date(Date.UTC(2024, 7, 11, 22, 55, 30, 0)).toString(),
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
strict(
  MDTG.parse("121155A").toString() ===
    new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        12,
        10,
        55,
        0,
        0,
      ),
    ).toString(),
);

console.log("All tests run.");
