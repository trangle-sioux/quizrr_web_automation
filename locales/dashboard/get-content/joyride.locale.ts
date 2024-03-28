import { Platforms } from '../../../enums/platform.enum';
import { readLocalesJsonFile } from '../../../utils/json/json-locales.util';
import { Languages } from '../../languages.locale';

function getJoyrideContent(languageTag?: string) {
  const lang = Languages.getLanguageAbbreviationOf(languageTag);
  const objectData = readLocalesJsonFile(Platforms.DASHBOARD, lang, 'joyride');
  return objectData;
}

export function getFacilityWelcomeContent(languageTag?: string) {
  const object = getJoyrideContent(languageTag);
  return object.facility_welcome.content;
}

export function getFacilityWelcomeTitle(languageTag?: string) {
  const object = getJoyrideContent(languageTag);
  return object.facility_welcome.title;
}

export function getWelcomeTitle(languageTag?: string) {
  const object = getJoyrideContent(languageTag);
  return object.welcome.title;
}

export function getShowMeAround(languageTag?: string) {
  const object = getJoyrideContent(languageTag);
  return object.show_me_around;
}
