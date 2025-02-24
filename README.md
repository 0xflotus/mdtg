# MDTG

This is a package that helps you to convert `Date` objects to [military date time](https://en.wikipedia.org/wiki/Date-time_group) and vice versa.

#### Limitations

Currently there is no support for different timezones.

### Install

```bash
npm install mdtg
```

### Usage

```js
import { MDTG } from "mdtg";

const mdtg = new MDTG();

console.log(mdtg.toMDT({ form: "short" }));
console.log(mdtg.toMDT({ form: "shortened" }));
console.log(mdtg.toMDT({ form: "long" }));

console.log(MDTG.parse("12135530Zaug24"));
console.log(MDTG.parse("121355Zaug24"));
console.log(MDTG.parse("121355Z"));
```
