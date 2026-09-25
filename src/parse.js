import { MONTHS, OFFSETS } from "./constants.js";
import {
  isExtendedFormat,
  isShortFormat,
  isStandardFormat,
  validateDateTime,
} from "./validation.js";

const parseInteger = (input) => Number.parseInt(input, 10);

const parseShort = (value) => {
  const day = parseInteger(value.slice(0, 2));
  const hours = parseInteger(value.slice(2, 4));
  const minutes = parseInteger(value.slice(4, 6));
  const timezone = value.slice(6, 7).toUpperCase();
  const now = new Date();

  validateDateTime({
    year: now.getUTCFullYear(),
    month: now.getUTCMonth(),
    day,
    hours,
    minutes,
  });

  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      day,
      hours + OFFSETS[timezone],
      minutes,
    ),
  );
};

const parseWithMonth = (value, { hasSeconds, timezoneIndex, monthStart }) => {
  const day = parseInteger(value.slice(0, 2));
  const hours = parseInteger(value.slice(2, 4));
  const minutes = parseInteger(value.slice(4, 6));
  const seconds = hasSeconds ? parseInteger(value.slice(6, 8)) : undefined;
  const timezone = value.slice(timezoneIndex, timezoneIndex + 1).toUpperCase();
  const month = MONTHS.indexOf(
    value.slice(monthStart, monthStart + 3).toLowerCase(),
  );
  const year = 2000 + parseInteger(value.slice(monthStart + 3, monthStart + 5));

  validateDateTime({
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
  });

  const dateParts = [year, month, day, hours + OFFSETS[timezone], minutes];
  if (seconds !== undefined) dateParts.push(seconds);

  return new Date(Date.UTC(...dateParts));
};

export const parseMDTG = (value) => {
  if (isShortFormat(value)) return parseShort(value);
  if (isStandardFormat(value)) {
    return parseWithMonth(value, {
      hasSeconds: false,
      timezoneIndex: 6,
      monthStart: 7,
    });
  }
  if (isExtendedFormat(value)) {
    return parseWithMonth(value, {
      hasSeconds: true,
      timezoneIndex: 8,
      monthStart: 9,
    });
  }

  throw new Error(`Invalid MDTG string "${value}"`);
};
