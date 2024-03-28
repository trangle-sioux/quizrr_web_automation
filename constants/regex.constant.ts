export const REGEX_NUMBER: RegExp = /(\d+)/;
export const REGEX_ANY_WORD_CHARACTERS: RegExp = /(\w+)/;
export const REGEX_ANSI_COLORS: RegExp = /\[\d+[a-z]|\\u001b[^m]*?m/gm;
export const REGEX_OPENING_CLOSING_TAG_0: RegExp = /\<0>(.*)<\/0>/;
export const REGEX_OPENING_CLOSING_TAG_1: RegExp = /\<1>(.*)<\/1>/;
export const REGEX_DASHBOARD_URL_PREFIX: RegExp = /\/\/(.*).api/;
export const REGEX_BACKWARD_SLASH: RegExp = /\\/;

// ================ Date time regex ==========
export const REGEX_MONTH_YEAR = /^\d{2}-\d{4}$/;
