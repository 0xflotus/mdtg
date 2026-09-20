import {
  LONG_FORMAT_REGEX,
  OFFSETS,
  SHORT_FORMAT_REGEX,
  SHORTENED_FORMAT_REGEX,
} from "./constants.js";

export const isShortFormat = (value) =>
  typeof value === "string" && SHORT_FORMAT_REGEX.test(value);

export const isShortenedFormat = (value) =>
  typeof value === "string" && SHORTENED_FORMAT_REGEX.test(value);

export const isLongFormat = (value) =>
  typeof value === "string" && LONG_FORMAT_REGEX.test(value);

export const validateDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError("Expected a valid Date object");
  }
};

export const validateTimezone = (timezone) => {
  const key = timezone?.toUpperCase();
  return key in OFFSETS ? key : "Z";
};

export const validateDateTime = ({
  year,
  month,
  day,
  hours,
  minutes,
  seconds,
}) => {
  const candidate = new Date(
    Date.UTC(year, month, day, hours, minutes, seconds ?? 0),
  );

  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month ||
    candidate.getUTCDate() !== day ||
    candidate.getUTCHours() !== hours ||
    candidate.getUTCMinutes() !== minutes ||
    candidate.getUTCSeconds() !== (seconds ?? 0)
  ) {
    throw new RangeError("Invalid MDTG date or time");
  }
};
