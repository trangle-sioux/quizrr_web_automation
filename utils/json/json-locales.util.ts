import { resolve } from 'path';
import { ciEquals } from '../string.util';
import * as util from 'util';
import {
  LOCALES_APP_CONTENT_PATH,
  LOCALES_IR_APP_V1_PATH,
  LOCALES_DASHBOARD_PATH,
} from '../../constants/path.constant';
import { readJsonFile } from './json.util';
import { Platforms } from '../../enums/platform.enum';

function getLocalesPath(
  platform: string,
  languageTag: string,
  objectName?: string,
) {
  let jsonPath: string;
  switch (platform) {
    case Platforms.DASHBOARD: {
      jsonPath = util.format(LOCALES_DASHBOARD_PATH, languageTag, objectName);
      break;
    }
    case Platforms.APP_CONTENT: {
      jsonPath = util.format(LOCALES_APP_CONTENT_PATH, languageTag);
      break;
    }
    default: {
      jsonPath = util.format(LOCALES_IR_APP_V1_PATH, languageTag);
      break;
    }
  }
  return resolve(`./${jsonPath}`);
}

export function readLocalesJsonFile(
  platform: string,
  languageTag: string,
  objectName?: string,
) {
  const jsonPath = getLocalesPath(platform, languageTag, objectName);
  let jsonObject = readJsonFile(jsonPath);
  return jsonObject;
}
