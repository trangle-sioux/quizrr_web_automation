import {
  REGEX_OPENING_CLOSING_TAG_0,
  REGEX_OPENING_CLOSING_TAG_1,
} from '../../../constants/regex.constant';
import { Platforms } from '../../../enums/platform.enum';
import { Languages } from '../../../locales/languages.locale';
import { readLocalesJsonFile } from '../../../utils/json/json-locales.util';
import { extractString } from '../../../utils/string.util';

function getRegistrationContent(languageTag?: string) {
  const lang = Languages.getLanguageAbbreviationOf(languageTag);
  const objectData = readLocalesJsonFile(
    Platforms.DASHBOARD,
    lang,
    'registration',
  );
  return objectData;
}

function getTermsConditionsText(languageTag?: string) {
  const registration = getRegistrationContent(languageTag);
  return registration.terms_conditions;
}

export function getPrivacyPolicyText(languageTag?: string) {
  const termsConditions = getTermsConditionsText(languageTag);
  return extractString(termsConditions, REGEX_OPENING_CLOSING_TAG_0);
}

export function getTermsConditionsOfUseText(languageTag?: string) {
  const termsConditions = getTermsConditionsText(languageTag);
  return extractString(termsConditions, REGEX_OPENING_CLOSING_TAG_1);
}
