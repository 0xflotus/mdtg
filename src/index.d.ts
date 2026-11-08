type MDTGFormat = "short" | "extended" | "standard";
type MDTGTemporalType = "plainDate" | "plainDateTime" | "zonedDateTime";

declare function formatMDTG(
  date?: Date,
  options?: { form?: MDTGFormat; timezone?: string },
): string;

declare function formatTemporalMDTG(
  date: Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime,
  options?: { form?: MDTGFormat; timezone?: string },
): string;

declare function isValidMDTG(mdtg: string, options?: { referenceDate?: Date }): boolean;
declare function parseMDTG(mdtg: string, options?: { referenceDate?: Date }): Date;

declare function parseTemporalMDTG(
  mdtg: string,
  options: { type: "plainDate"; referenceDate?: Temporal.PlainDate },
): Temporal.PlainDate;
declare function parseTemporalMDTG(
  mdtg: string,
  options: { type: "plainDateTime"; referenceDate?: Temporal.PlainDate },
): Temporal.PlainDateTime;
declare function parseTemporalMDTG(
  mdtg: string,
  options: { type: "zonedDateTime"; referenceDate?: Temporal.PlainDate },
): Temporal.ZonedDateTime;

declare function isExtendedFormat(mdtg: string): boolean;
declare function isMDTG(mdtg: string): boolean;
declare function isShortFormat(mdtg: string): boolean;
declare function isStandardFormat(mdtg: string): boolean;

export type { MDTGFormat, MDTGTemporalType };

export {
  formatMDTG,
  formatTemporalMDTG,
  isExtendedFormat,
  isMDTG,
  isShortFormat,
  isStandardFormat,
  isValidMDTG,
  parseMDTG,
  parseTemporalMDTG,
};
