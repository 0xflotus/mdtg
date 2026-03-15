const normalizeNumber = (number) => String(number).padStart(2, "0");
const parseInteger = (input) => Number.parseInt(input, 10);

export class MDTG {
  #currentDate;

  static FORM = {
    SHORT: "short",
    SHORTENED: "shortened",
    LONG: "long",
  };

  static #months = [
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

  static #shortFormatRegex = /^[0-9]{6}[A-Z]$/;
  static #shortenedFormatRegex =
    /^[0-9]{6}[A-Z](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[0-9]{2}$/i;
  static #longFormatRegex =
    /^[0-9]{8}[A-Z](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[0-9]{2}$/i;

  static #offset = {
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
  };

  constructor(date) {
    if (date && !(date instanceof Date)) {
      throw new TypeError("Expected Date object");
    }

    const now = new Date();

    this.#currentDate =
      date ??
      new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds(),
          now.getUTCMilliseconds(),
        ),
      );
  }

  static #validateTimezone(tz) {
    const key = tz?.toUpperCase();
    return key in MDTG.#offset ? key : "Z";
  }

  #createDateWithOffset(offset) {
    const d = this.#currentDate;

    return new Date(
      Date.UTC(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours() - offset,
        d.getUTCMinutes(),
        d.getUTCSeconds(),
      ),
    );
  }

  static isShortFormat(str) {
    return MDTG.#shortFormatRegex.test(str);
  }

  static isShortenedFormat(str) {
    return MDTG.#shortenedFormatRegex.test(str);
  }

  static isLongFormat(str) {
    return MDTG.#longFormatRegex.test(str);
  }

  #toShortMDT(timezone = "Z") {
    const tz = MDTG.#validateTimezone(timezone);
    const date = this.#createDateWithOffset(MDTG.#offset[tz]);

    const result = [date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()]
      .map(normalizeNumber)
      .concat(tz)
      .join("");

    if (!MDTG.isShortFormat(result)) {
      throw new Error("Failed to build short MDTG");
    }

    return result;
  }

  #toLongMDT(timezone = "Z") {
    const tz = MDTG.#validateTimezone(timezone);
    const date = this.#createDateWithOffset(MDTG.#offset[tz]);

    const result = [
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    ]
      .map(normalizeNumber)
      .concat(
        tz,
        MDTG.#months[date.getUTCMonth()],
        normalizeNumber(date.getUTCFullYear() % 100),
      )
      .join("");

    if (!MDTG.isLongFormat(result)) {
      throw new Error("Failed to build long MDTG");
    }

    return result;
  }

  #toShortenedMDT(timezone = "Z") {
    const tz = MDTG.#validateTimezone(timezone);
    const date = this.#createDateWithOffset(MDTG.#offset[tz]);

    const result = [
      this.#toShortMDT(tz),
      MDTG.#months[date.getUTCMonth()],
      normalizeNumber(date.getUTCFullYear() % 100),
    ].join("");

    if (!MDTG.isShortenedFormat(result)) {
      throw new Error("Failed to build shortened MDTG");
    }

    return result;
  }

  toMDT({ form = MDTG.FORM.LONG, timezone = "Z" } = {}) {
    switch (form) {
      case MDTG.FORM.SHORT:
        return this.#toShortMDT(timezone);
      case MDTG.FORM.SHORTENED:
        return this.#toShortenedMDT(timezone);
      default:
        return this.#toLongMDT(timezone);
    }
  }

  static #parseShort(str) {
    const day = parseInteger(str.slice(0, 2));
    const hours = parseInteger(str.slice(2, 4));
    const minutes = parseInteger(str.slice(4, 6));
    const tz = str.slice(6, 7).toUpperCase();

    const today = new Date();

    return new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        day,
        hours + MDTG.#offset[tz],
        minutes,
      ),
    );
  }

  static #parseShortened(str) {
    const day = parseInteger(str.slice(0, 2));
    const hours = parseInteger(str.slice(2, 4));
    const minutes = parseInteger(str.slice(4, 6));
    const tz = str.slice(6, 7).toUpperCase();

    const month = MDTG.#months.indexOf(str.slice(7, 10).toLowerCase());
    if (month === -1) throw new Error("Invalid month");

    const year = 2000 + parseInteger(str.slice(10, 12));

    return new Date(
      Date.UTC(year, month, day, hours + MDTG.#offset[tz], minutes),
    );
  }

  static #parseLong(str) {
    const day = parseInteger(str.slice(0, 2));
    const hours = parseInteger(str.slice(2, 4));
    const minutes = parseInteger(str.slice(4, 6));
    const seconds = parseInteger(str.slice(6, 8));
    const tz = str.slice(8, 9).toUpperCase();

    const month = MDTG.#months.indexOf(str.slice(9, 12).toLowerCase());
    if (month === -1) throw new Error("Invalid month");

    const year = 2000 + parseInteger(str.slice(12, 14));

    return new Date(
      Date.UTC(year, month, day, hours + MDTG.#offset[tz], minutes, seconds),
    );
  }

  static parse(str) {
    if (MDTG.isShortFormat(str)) return MDTG.#parseShort(str);
    if (MDTG.isShortenedFormat(str)) return MDTG.#parseShortened(str);
    if (MDTG.isLongFormat(str)) return MDTG.#parseLong(str);

    throw new Error(`Invalid MDTG string "${str}"`);
  }

  toDate() {
    return new Date(this.#currentDate);
  }
}
