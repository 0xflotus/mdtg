import { OFFSETS } from "./constants.js";
import { formatMDTG } from "./format.js";
import { parseMDTG } from "./parse.js";
import {
  isExtendedFormat,
  isShortFormat,
  isStandardFormat,
  validateTimezone,
} from "./validation.js";

const HOUR_IN_NANOSECONDS = 3_600_000_000_000;

const getTemporal = () => {
  if (!globalThis.Temporal) {
    throw new Error("The Temporal API is not available in this runtime");
  }

  return globalThis.Temporal;
};

const createUTCDate = (year, month, day, hours = 0, minutes = 0, seconds = 0) => {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hours, minutes, seconds, 0);
  return date;
};

const getTimezoneForOffset = (offsetNanoseconds) => {
  if (offsetNanoseconds % HOUR_IN_NANOSECONDS !== 0) {
    throw new RangeError("MDTG timezone letters only support whole-hour offsets");
  }

  const offsetHours = offsetNanoseconds / HOUR_IN_NANOSECONDS;
  const entry = Object.entries(OFFSETS).find(([, offset]) => offset === -offsetHours);

  if (!entry) {
    throw new RangeError("ZonedDateTime offset has no corresponding MDTG timezone letter");
  }

  return entry[0];
};

const getTimezoneOffset = (timezone) => {
  const offsetHours = -OFFSETS[timezone];
  const sign = offsetHours < 0 ? "-" : "+";
  const hours = String(Math.abs(offsetHours)).padStart(2, "0");

  return `${sign}${hours}:00`;
};

const getTimezoneFromMDTG = (value) => {
  if (isShortFormat(value) || isStandardFormat(value)) return value[6].toUpperCase();
  if (isExtendedFormat(value)) return value[8].toUpperCase();
  return undefined;
};

export const formatTemporalMDTG = (value, { form, timezone: timezoneInput } = {}) => {
  const Temporal = getTemporal();
  let date;
  let timezone;

  if (value instanceof Temporal.PlainDate) {
    const plainDate = value.withCalendar("iso8601");
    timezone = "Z";
    date = createUTCDate(plainDate.year, plainDate.month, plainDate.day);
  } else if (value instanceof Temporal.PlainDateTime) {
    const plainDateTime = value.withCalendar("iso8601");
    timezone = validateTimezone(timezoneInput);
    date = createUTCDate(
      plainDateTime.year,
      plainDateTime.month,
      plainDateTime.day,
      plainDateTime.hour + OFFSETS[timezone],
      plainDateTime.minute,
      plainDateTime.second,
    );
  } else if (value instanceof Temporal.ZonedDateTime) {
    const zonedDateTime = value.withCalendar("iso8601");
    timezone = getTimezoneForOffset(zonedDateTime.offsetNanoseconds);
    date = createUTCDate(
      zonedDateTime.year,
      zonedDateTime.month,
      zonedDateTime.day,
      zonedDateTime.hour + OFFSETS[timezone],
      zonedDateTime.minute,
      zonedDateTime.second,
    );
  } else {
    throw new TypeError(
      "Expected a Temporal.PlainDate, Temporal.PlainDateTime, or Temporal.ZonedDateTime",
    );
  }

  return formatMDTG(date, { form, timezone });
};

export const parseTemporalMDTG = (value, { type, referenceDate } = {}) => {
  const Temporal = getTemporal();

  if (!["plainDate", "plainDateTime", "zonedDateTime"].includes(type)) {
    throw new TypeError('Expected type to be "plainDate", "plainDateTime", or "zonedDateTime"');
  }

  let parseOptions;
  if (referenceDate !== undefined) {
    if (!(referenceDate instanceof Temporal.PlainDate)) {
      throw new TypeError("Expected referenceDate to be a Temporal.PlainDate");
    }

    const plainDate = referenceDate.withCalendar("iso8601");
    parseOptions = {
      referenceDate: createUTCDate(plainDate.year, plainDate.month, 1),
    };
  }

  const parsedDate = parseMDTG(value, parseOptions);
  const timezone = getTimezoneFromMDTG(value);
  const offset = getTimezoneOffset(timezone);
  const zonedDateTime = Temporal.Instant.fromEpochMilliseconds(
    parsedDate.getTime(),
  ).toZonedDateTimeISO(offset);

  switch (type) {
    case "plainDate":
      return zonedDateTime.toPlainDate();
    case "plainDateTime":
      return zonedDateTime.toPlainDateTime();
    default:
      return zonedDateTime;
  }
};
