import { FORM, MONTHS, OFFSETS } from "./constants.js";
import {
  isExtendedFormat,
  isShortFormat,
  isStandardFormat,
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

const buildExtended = (date, timezone) => {
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

  if (!isExtendedFormat(result)) {
    throw new Error("Failed to build extended MDTG");
  }

  return result;
};

const buildStandard = (date, timezone) => {
  const result = [
    buildShort(date, timezone),
    MONTHS[date.getUTCMonth()],
    normalizeNumber(date.getUTCFullYear() % 100),
  ].join("");

  if (!isStandardFormat(result)) {
    throw new Error("Failed to build standard MDTG");
  }

  return result;
};

export const formatMDTG = (
  date = new Date(),
  { form = FORM.EXTENDED, timezone: timezoneInput = "Z" } = {},
) => {
  validateDate(date);

  const timezone = validateTimezone(timezoneInput);
  const adjustedDate = createDateWithOffset(date, OFFSETS[timezone]);

  switch (form) {
    case FORM.SHORT:
      return buildShort(adjustedDate, timezone);
    case FORM.STANDARD:
      return buildStandard(adjustedDate, timezone);
    default:
      return buildExtended(adjustedDate, timezone);
  }
};
