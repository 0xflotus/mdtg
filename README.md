# MDTG

This package converts `Date` objects to [military date time](https://en.wikipedia.org/wiki/Date-time_group) and vice versa.

### Install

```bash
npm install mdtg
```

### Usage

```js
import { formatMDTG, parseMDTG } from "mdtg";

const date = new Date(Date.UTC(2024, 7, 12, 11, 55, 30));

formatMDTG(date, { form: "short" });      // "121155Z"
formatMDTG(date, { form: "standard" });   // "121155Zaug24"
formatMDTG(date);                         // "12115530Zaug24" (extended by default)

// A is UTC+1, so local time is one hour ahead of UTC.
const value = formatMDTG(date, { timezone: "A" }); // "12125530Aaug24"
parseMDTG(value).toISOString();                       // "2024-08-12T11:55:30.000Z"

parseMDTG("121155Zaug24").toISOString(); // "2024-08-12T11:55:00.000Z"
parseMDTG("121155Z");                    // month and year are current UTC month/year
```

### API

#### `formatMDTG(date, options)`

Converts a valid `Date` to a date-time group. `date` defaults to the current
date. `options.form` is `"short"`, `"standard"`, or `"extended"` (the default).
`options.timezone` accepts the NATO time-zone letters `A` through `Z`;
lowercase letters are accepted and unknown values default to `Z`. The timezone
letter determines the displayed local time; parsing converts it back to a UTC
`Date`.

```js
formatMDTG(new Date(Date.UTC(2024, 7, 12, 11, 55, 30)), {
  form: "extended",
  timezone: "A",
});
// "12125530Aaug24"
```

#### `parseMDTG(value, options)`

Parses short (`121155Z`), standard (`121155Zaug24`), and extended
(`12115530Zaug24`) formats into a `Date`. Short values use the current UTC
month and year and have no seconds. Years are interpreted as `2000` through
`2099`.

```js
import { parseMDTG } from "mdtg";

parseMDTG("121155Zaug24").toISOString();   // "2024-08-12T11:55:00.000Z"
parseMDTG("12115530Zaug24").toISOString(); // "2024-08-12T11:55:30.000Z"
parseMDTG("12125530Aaug24").toISOString(); // "2024-08-12T11:55:30.000Z"

parseMDTG("121155Z"); // uses the current UTC month and year

parseMDTG("121155Z", {
  referenceDate: new Date(Date.UTC(2024, 7, 1)),
}); // uses August 2024, independent of the system date
```

Invalid calendar dates and times, such as `310224Zfeb24` or `126155Z`, throw a
`RangeError`. Other invalid values throw an `Error`.

`referenceDate` is an optional valid `Date` used only for short values that omit
the month and year. If omitted, the current UTC month and year are used.

#### Format checks

`isShortFormat`, `isStandardFormat`, and `isExtendedFormat` check whether a string
matches the structure of the corresponding format. `isMDTG` checks whether a
string matches any of the three structures. These checks do not validate
calendar dates or times; use `isValidMDTG` when semantic validity is needed.

```js
import {
  isShortFormat,
  isStandardFormat,
  isExtendedFormat,
  isMDTG,
  isValidMDTG,
} from "mdtg";

isShortFormat("121155Z");          // true
isStandardFormat("121155Zaug24"); // true
isExtendedFormat("12115530Zaug24"); // true
isMDTG("121155Zaug24");      // true
isMDTG("invalid");           // false
isMDTG("310224Zfeb24");      // true: structurally valid
isValidMDTG("310224Zfeb24"); // false: invalid calendar date
```

For short values, `isValidMDTG` also accepts the same optional `referenceDate`
as `parseMDTG`.
