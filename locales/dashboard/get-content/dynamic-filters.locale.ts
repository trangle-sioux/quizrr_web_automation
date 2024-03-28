import { Platforms } from '../../../enums/platform.enum';
import { readLocalesJsonFile } from '../../../utils/json/json-locales.util';
import { Languages } from '../../languages.locale';

function getDynamicFiltersContent(languageTag?: string) {
  const lang = Languages.getLanguageAbbreviationOf(languageTag);
  const objectData = readLocalesJsonFile(
    Platforms.DASHBOARD,
    lang,
    'dynamic_filters',
  );
  return objectData;
}

const MARKET_CONTENT = getDynamicFiltersContent().market;

export function getMarketByName(name: string) {
  return MARKET_CONTENT[name];
}
