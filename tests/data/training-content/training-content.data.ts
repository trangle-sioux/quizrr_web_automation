import {
  getTrainingContentFolderPathByToken,
  readJsonFilesInFolder as readJsonFileInFolder,
} from '../../../utils';
import * as util from 'util';
import {
  HYPHEN_SYMBOL,
  TRAINING_CONTENT_PATH,
  TRAINING_CONTENT_WITH_MARKET_PATH,
  UNDERSCORE_SYMBOL,
} from '../../../constants';
import { Languages } from '../../../locales/languages.locale';
import { getUserAccountId } from '../user-info/users.data';
import { getAccountAccessibleQRCodeId } from '../accounts/account.data';
import { getQRCodeConfigTrainingSeriesList } from '../qr-codes/qr-code.data';

function getContentFolderPathByToken(token: string) {
  return util.format(
    TRAINING_CONTENT_PATH,
    getTrainingContentFolderPathByToken(token),
  );
}

function getTrainingContentDataPathByProgramIdAndMarket(
  programId: string,
  market: string,
) {
  return util.format(TRAINING_CONTENT_WITH_MARKET_PATH, programId, market);
}

function getJsonTrainingContentByProgramIdAndMarket(
  programId: string,
  market: string,
) {
  return readJsonFileInFolder(
    getTrainingContentDataPathByProgramIdAndMarket(programId, market),
  );
}

/**
 * For the sign-up as a pre-condition, training content is determined by sign-up| invite token.
 * For the sign-in as a pre-condition, the token is pre-defined by the user's email address, and this token determines the training content.
 * @param token: the sign-up or invite token
 * @returns the coressponding training-content as JSON object
 */
function readTrainingContentFileByToken(token: string) {
  let jsonObject = readJsonFileInFolder(getContentFolderPathByToken(token));
  return jsonObject;
}

export function getTrainingContentsByProgramIdAndMarket(
  programId: string,
  market: string,
) {
  programId = programId.split(UNDERSCORE_SYMBOL).join(HYPHEN_SYMBOL);
  return getJsonTrainingContentByProgramIdAndMarket(programId, market);
}

function getTrainingContentsByEmail(email: string) {
  const userTrainings = [];
  const accountId: string = getUserAccountId(email);
  const qrCodeId: string = getAccountAccessibleQRCodeId(accountId);
  const trainingSeriesLst = getQRCodeConfigTrainingSeriesList(qrCodeId);
  for (const training of trainingSeriesLst) {
    const market: string = training.market;
    const programId: string = training.programId
      .split(UNDERSCORE_SYMBOL)
      .join(HYPHEN_SYMBOL);
    userTrainings.push(
      getTrainingContentsByProgramIdAndMarket(programId, market),
    );
  }
  return userTrainings;
}

// ========================= APP: "app" section ========================
export function getTheTrainingSeriesNameByToken(
  token: string,
  languageNameInEnglish?: string,
) {
  const abbreviation = Languages.getLanguageAbbreviationOf(
    languageNameInEnglish,
  );
  const content = readTrainingContentFileByToken(token);
  return content.app.name[abbreviation];
}

export function getLearningModuleKeysByToken(token: string): string[] {
  const content = readTrainingContentFileByToken(token);
  return content.app.learning_modules;
}

export function getLearningModuleKeyByTokenAndModuleOrder(
  token: string,
  moduleOrder: number,
) {
  const moduleKeys = getLearningModuleKeysByToken(token);
  return moduleKeys[moduleOrder - 1];
}

// ========================= LEARNING MODULES: "learning_modules" section ========================
function getLearningModulesByToken(token: string) {
  const content = readTrainingContentFileByToken(token);
  return content.learning_modules;
}

export function getLearningModuleNameByToken(
  token: string,
  moduleKey: string,
  languageNameInEnglish?: string,
) {
  const abbreviation = Languages.getLanguageAbbreviationOf(
    languageNameInEnglish,
  );
  const content = readTrainingContentFileByToken(token);
  return content.learning_modules[moduleKey].name[abbreviation];
}

function getLearningAdvancedLocationsFromTrainingDataOfLearningModuleKey(
  trainingData: any,
  learningModuleKey: string,
) {
  return trainingData.learning_modules[learningModuleKey].advanced_locations;
}

function getLearningModuleLocationsFromTrainingDataOfLearningModuleKey(
  trainingData: any,
  learningModuleKey: string,
) {
  return trainingData.learning_modules[learningModuleKey].locations;
}

export function getLearningModuleKeysAdvancedLocationsInListByEmail(
  email: string,
) {
  const userTrainings = getTrainingContentsByEmail(email);
  const results = [];
  for (const training of userTrainings) {
    const learningModuleKeys = training.app.learning_modules;
    for (const key of learningModuleKeys) {
      const advanceLocations =
        getLearningAdvancedLocationsFromTrainingDataOfLearningModuleKey(
          training,
          key,
        );
      if (advanceLocations.length !== 0) {
        results.push(key);
      }
    }
  }
  return results;
}

export function getLearningModuleKeysLocationsInListByEmail(email: string) {
  const userTrainings = getTrainingContentsByEmail(email);
  const results = [];
  for (const training of userTrainings) {
    const learningModuleKeys = training.app.learning_modules;
    for (const key of learningModuleKeys) {
      const locations =
        getLearningModuleLocationsFromTrainingDataOfLearningModuleKey(
          training,
          key,
        );
      if (locations.length !== 0) {
        results.push(key);
      }
    }
  }
  return results;
}

export function isTheLearningModuleKeyIncludedInTheModuleKeysList(
  learningModuleKey: string,
  moduleKeysList: any,
) {
  let result: boolean = false;
  if (moduleKeysList.includes(learningModuleKey)) {
    result = true;
  }
  return result;
}

export function getAllLearningModuleNamesInListByEmail(
  email: string,
  languageTag?: string,
) {
  const dataLst = getTrainingContentsByEmail(email);
  const lang = Languages.getLanguageAbbreviationOf(languageTag);
  const moduleNames = [];
  for (const data of dataLst) {
    const moduleKeys = data.app.learning_modules;
    for (const moduleKey of moduleKeys) {
      const learningModule = data.learning_modules[moduleKey];
      moduleNames.push(learningModule.name[lang]);
    }
  }
  return moduleNames;
}

export function getAllLearningModuleKeysInMapByEmail(email: string) {
  let mapData = new Map<string, string[]>();
  const dataLst = getTrainingContentsByEmail(email);
  for (const data of dataLst) {
    mapData.set(data.id, data.app.learning_modules);
  }
  return mapData;
}

export function getLearningModuleNameByLearningModuleKeyFromTrainingData(
  trainingData: any,
  moduleKey: string,
  languageTag?: string,
) {
  let moduleName;
  const lang = Languages.getLanguageAbbreviationOf(languageTag);
  const learningModule =
    trainingData.learning_modules[
      moduleKey as keyof typeof trainingData.learning_modules
    ];
  moduleName = learningModule.name[lang as keyof typeof learningModule.name];
  return moduleName;
}

// === LEARNING MODULES >> LOCATIONS: "locations", "advanced_locations", "baseline_locations", "quickquiz_locations", and "post_training_locations" sections ===
export function getBaselineLocationsByToken(token: string, moduleKey: string) {
  return getLearningModulesByToken(token)[moduleKey].baseline_locations;
}

export function getLocationsByToken(token: string, moduleKey: string) {
  return getLearningModulesByToken(token)[moduleKey].locations;
}

export function getAdvancedLocationsByToken(token: string, moduleKey: string) {
  return getLearningModulesByToken(token)[moduleKey].advanced_locations;
}

export function getPostTrainingLocationsByToken(
  token: string,
  moduleKey: string,
) {
  return getLearningModulesByToken(token)[moduleKey].post_training_locations;
}

// ========================= QUESTIONS: "questions" section ========================
export function getQuestionTextByToken(
  token: string,
  questionKey: string,
  languageNameInEnglish?: string,
) {
  const abbreviation = Languages.getLanguageAbbreviationOf(
    languageNameInEnglish,
  );
  const content = readTrainingContentFileByToken(token);
  return content.questions[questionKey].text[abbreviation];
}
