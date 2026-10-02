declare function formatMDTG(
  date?: Date,
  options?: { form?: "short" | "extended" | "standard"; timezone?: string },
): string;

declare function isValidMDTG(
  mdtg: string,
  options?: { referenceDate?: Date },
): boolean;
declare function parseMDTG(
  mdtg: string,
  options?: { referenceDate?: Date },
): Date;

declare function isExtendedFormat(mdtg: string): boolean;
declare function isMDTG(mdtg: string): boolean;
declare function isShortFormat(mdtg: string): boolean;
declare function isStandardFormat(mdtg: string): boolean;

export {
  formatMDTG,
  isExtendedFormat,
  isMDTG,
  isShortFormat,
  isStandardFormat,
  isValidMDTG,
  parseMDTG,
};
