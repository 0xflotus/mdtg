# MDTG

This package converts `Date` objects to [military date time](https://en.wikipedia.org/wiki/Date-time_group) and vice versa.

### Install

```bash
npm install mdtg
```

### Usage

```js
import { parse, formatMDTG } from "mdtg";

const date = new Date();

console.log(formatMDTG(date, { form: "short" }));
console.log(formatMDTG(date, { form: "shortened" }));
console.log(formatMDTG(date, { form: "long" }));

console.log(parse("12135530Zaug24"));
console.log(parse("12135530Asep24"));
console.log(parse("121355LOCT24"));
console.log(parse("121355M"));
```

### API

#### `formatMDTG(date, options)`

Converts a valid `Date` to a date-time group. `date` defaults to the current
date. `options.form` is `"short"`, `"shortened"`, or `"long"` (the default).
`options.timezone` accepts the NATO time-zone letters `A` through `Z`;
lowercase letters are accepted and unknown values default to `Z`.

```js
formatMDTG(new Date(Date.UTC(2024, 7, 12, 11, 55, 30)), {
  form: "long",
  timezone: "A",
});
// "12125530Aaug24"
```

#### `parse(value)`

Parses short (`121155Z`), shortened (`121155Zaug24`), and long
(`12115530Zaug24`) formats into a `Date`. Short values use the current UTC
month and year. Years are interpreted as `2000` through `2099`.

Invalid calendar dates and times, such as `310224Zfeb24` or `126155Z`, throw a
`RangeError`. Other invalid values throw an `Error`.
