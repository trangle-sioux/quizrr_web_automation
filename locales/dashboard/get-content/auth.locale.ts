import { Platforms } from '../../../enums/platform.enum';
import { readLocalesJsonFile } from '../../../utils/json/json-locales.util';
import { Languages } from '../../languages.locale';

function getAuthContent(languageTag?: string) {
  const lang = Languages.getLanguageAbbreviationOf(languageTag);
  const objectData = readLocalesJsonFile(Platforms.DASHBOARD, lang, 'auth');
  return objectData;
}

export function getSignInButtonText(languageTag?: string) {
  const object = getAuthContent(languageTag);
  return object.buttons.sign_in;
}
export function getGoToTrainingButtonText(languageTag?: string) {
  const object = getAuthContent(languageTag);
  return object.buttons.go_to_training;
}

export function getErrorCode404Msg(languageTag?: string) {
  const object = getAuthContent(languageTag);
  return object.error_codes[404];
}

export function getErrorCodeInvalidOtpMsg(languageTag?: string) {
  const object = getAuthContent(languageTag);
  return object.error_codes.invalid_otp;
}
