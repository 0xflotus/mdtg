import {MDTG} from './index.js';
import {strict} from 'node:assert';

const dateToTest = new Date(2024, 7, 12, 13, 55, 30, 0);
const mdtg = new MDTG(dateToTest);

strict("121355Z" === mdtg.toMDT({form: "short"}));
strict("121355Zaug24" === mdtg.toMDT({form: "shortened"}));
strict("12135530Zaug24" === mdtg.toMDT({form: "long"}));
strict("12135530Zaug24" === mdtg.toMDT());

strict(MDTG.parse("12135530Zaug24").toString() === (new Date(2024, 7, 12, 13, 55, 30, 0)).toString());
strict(MDTG.parse("121355Zaug24").toString() === (new Date(2024, 7, 12, 13, 55, 0, 0)).toString());
strict(MDTG.parse("121355ZAUG24").toString() === (new Date(2024, 7, 12, 13, 55, 0, 0)).toString());
strict(MDTG.parse("121355Z").toString() === (new Date((new Date()).getFullYear(), (new Date()).getMonth(), 12, 13, 55, 0, 0)).toString());


console.log("All tests run.")