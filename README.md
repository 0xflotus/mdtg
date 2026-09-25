# MDTG

This package converts `Date` objects to [military date time](https://en.wikipedia.org/wiki/Date-time_group) and vice versa.

### Install

```bash
npm install mdtg
```

### Usage

```js
import { FORM, formatMDTG, parse } from "mdtg";

const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));

formatMDTG(date, { form: FORM.SHORT });      // "121155Z"
formatMDTG(date, { form: FORM.SHORTENED });  // "121155Zaug24"
formatMDTG(date);                            // "12115530Zaug24" (long by default)

// A is UTC+1, so local time is one hour ahead of UTC.
const value = formatMDTG(date, { timezone: "A" }); // "12125530Aaug24"
parse(value).toISOString();                       // "2024-08-12T11:55:30.000Z"

parse("121155Zaug24").toISOString(); // "2024-08-12T11:55:00.000Z"
parse("121155Z");                    // month and year are current UTC month/year
```

### API

#### `formatMDTG(date, options)`

Converts a valid `Date` to a date-time group. `date` defaults to the current
date. `options.form` is `"short"`, `"shortened"`, or `"long"` (the default).
`options.timezone` accepts the NATO time-zone letters `A` through `Z`;
lowercase letters are accepted and unknown values default to `Z`. The timezone
letter determines the displayed local time; parsing converts it back to a UTC
`Date`.

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
month and year and have no seconds. Years are interpreted as `2000` through
`2099`.

```js
import { parse } from "mdtg";

parse("121155Zaug24").toISOString();   // "2024-08-12T11:55:00.000Z"
parse("12115530Zaug24").toISOString(); // "2024-08-12T11:55:30.000Z"
parse("12125530Aaug24").toISOString(); // "2024-08-12T11:55:30.000Z"

parse("121155Z"); // uses the current UTC month and year
```

Invalid calendar dates and times, such as `310224Zfeb24` or `126155Z`, throw a
`RangeError`. Other invalid values throw an `Error`.

#### Format checks

`isShortFormat`, `isShortenedFormat`, and `isLongFormat` check whether a string
matches the structure of the corresponding format. `isMDTGFormat` checks
whether a string matches any of the three formats.

```js
import {
  isShortFormat,
  isShortenedFormat,
  isLongFormat,
  isMDTGFormat,
} from "mdtg";

isShortFormat("121155Z");          // true
isShortenedFormat("121155Zaug24"); // true
isLongFormat("12115530Zaug24");    // true
isMDTGFormat("121155Zaug24");      // true
isMDTGFormat("invalid");           // false
```
