export const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export const OFFSETS = Object.freeze({
  Y: 12,
  X: 11,
  W: 10,
  V: 9,
  U: 8,
  T: 7,
  S: 6,
  R: 5,
  Q: 4,
  P: 3,
  O: 2,
  N: 1,
  Z: 0,
  A: -1,
  B: -2,
  C: -3,
  D: -4,
  E: -5,
  F: -6,
  G: -7,
  H: -8,
  I: -9,
  J: -10,
  K: -11,
  L: -12,
  M: -13,
});

export const SHORT_FORMAT_REGEX = /^[0-9]{6}[A-Z]$/;
export const SHORTENED_FORMAT_REGEX =
  /^[0-9]{6}[A-Z](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[0-9]{2}$/i;
export const LONG_FORMAT_REGEX =
  /^[0-9]{8}[A-Z](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[0-9]{2}$/i;

export const FORM = Object.freeze({
  SHORT: "short",
  SHORTENED: "shortened",
  LONG: "long",
});
