import { FORM, MONTHS, OFFSETS } from "./constants.js";
import {
  isLongFormat,
  isShortenedFormat,
  isShortFormat,
  validateDate,
  validateTimezone,
} from "./validation.js";

const normalizeNumber = (number) => String(number).padStart(2, "0");

const createDateWithOffset = (date, offset) =>
  new Date(date.getTime() - offset * 60 * 60 * 1000);

const buildShort = (date, timezone) => {
  const result = [date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()]
    .map(normalizeNumber)
    .concat(timezone)
    .join("");

  if (!isShortFormat(result)) {
    throw new Error("Failed to build short MDTG");
  }

  return result;
};

const buildLong = (date, timezone) => {
  const result = [
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  ]
    .map(normalizeNumber)
    .concat(
      timezone,
      MONTHS[date.getUTCMonth()],
      normalizeNumber(date.getUTCFullYear() % 100),
    )
    .join("");

  if (!isLongFormat(result)) {
    throw new Error("Failed to build long MDTG");
  }

  return result;
};

const buildShortened = (date, timezone) => {
  const result = [
    buildShort(date, timezone),
    MONTHS[date.getUTCMonth()],
    normalizeNumber(date.getUTCFullYear() % 100),
  ].join("");

  if (!isShortenedFormat(result)) {
    throw new Error("Failed to build shortened MDTG");
  }

  return result;
};

export const formatMDTG = (
  date = new Date(),
  { form = FORM.LONG, timezone: timezoneInput = "Z" } = {},
) => {
  validateDate(date);

  const timezone = validateTimezone(timezoneInput);
  const adjustedDate = createDateWithOffset(date, OFFSETS[timezone]);

  switch (form) {
    case FORM.SHORT:
      return buildShort(adjustedDate, timezone);
    case FORM.SHORTENED:
      return buildShortened(adjustedDate, timezone);
    default:
      return buildLong(adjustedDate, timezone);
  }
};
