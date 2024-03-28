import { environment as ENV } from '../../../utils/environment.util';
import * as util from 'util';
import { SESSIONS_V2_DATA_TEST_PATH } from '../../../constants';
import { getEnumEnvironment, MemberTraningStatus } from '../../../enums';
import {
  calculateNumberOfCompletedModulesForUserByEmail,
  ciEquals,
  compareArrays,
  converStringDateToStringDate,
  filterValuesByKeyInMap,
  readJsonFile,
} from '../../../utils';
import {
  getPlayerEmailByGenerateId,
  getPlayerIdCleanByGenerateId,
  isThereManagerLevelByGenerateId,
} from '../players/player.data';
import {
  getLearningModuleNameByLearningModuleKeyFromTrainingData,
  getTrainingContentsByProgramIdAndMarket,
  getLearningModuleKeysLocationsInListByEmail,
  getLearningModuleKeysAdvancedLocationsInListByEmail,
} from '../training-content/training-content.data';
import { getTeamManagementStatus } from '../../../locales/dashboard/get-content';
import { TrainingReportColumn } from '../../../enums/training-report-column.enum';
import { TrainingLevelKey } from '../../../enums/training-lelvel.enum';

function getSessionsV2DataPath() {
  const env = ENV.TEST_ENVIRONMENT;
  return util.format(SESSIONS_V2_DATA_TEST_PATH, getEnumEnvironment(env));
}

const SESSION_V2_DATA = readJsonFile(getSessionsV2DataPath());

function filterSessionsV2DataByGeneratedId(generatedId: string) {
  let results = [];
  for (const session of SESSION_V2_DATA) {
    for (const player of session.players) {
      if (player.generatedId == generatedId) {
        results.push(session);
      }
    }
  }
  return results;
}

export function getLearningModuleKeysListByGeneratedIdInSessionV2(
  generatedId: string,
) {
  const sessions = filterSessionsV2DataByGeneratedId(generatedId);
  let moduleKeysLst = [];
  for (const session of sessions) {
    moduleKeysLst.push(session.learningModuleKey);
  }
  return moduleKeysLst;
}

export function getAdvancedLearningModuleKeysListByGenerateIdInSessionV2(
  generatedId: string,
) {
  const sessions = filterSessionsV2DataByGeneratedId(generatedId);
  let advencedModuleKeysLst = [];
  for (const session of sessions) {
    if (ciEquals(session.level, TrainingLevelKey.ADVANCED)) {
      advencedModuleKeysLst.push(session.learningModuleKey);
    }
    return advencedModuleKeysLst;
  }
}

export function getBasicLearningModuleKeysListByGeneratedIdInSessionV2(
  generatedId: string,
) {
  const sessions = filterSessionsV2DataByGeneratedId(generatedId);
  let basicModuleKeysLst = [];
  for (const session of sessions) {
    if (ciEquals(session.level, TrainingLevelKey.BASIC)) {
      basicModuleKeysLst.push(session.learningModuleKey);
    }
  }
  return basicModuleKeysLst;
}

export function getLevelOfLearningModuleKeyByGeneratedIdInSessionV2(
  generatedId: string,
  learningModuleKey: string,
) {
  const sessions = filterSessionsV2DataByGeneratedId(generatedId);
  let level;
  for (const session of sessions) {
    if (session.learningModulkey == learningModuleKey) {
      level = session.level;
      break;
    }
  }
  return level;
}

export function calculateTheNumberOfCompletedLearningModulesOfUserByGenerateIdInSessionV2(
  generatedId: string,
) {
  const completedModuleKeys =
    getLearningModuleKeysListByGeneratedIdInSessionV2(generatedId);
  return completedModuleKeys.length;
}

function getAdvancedLearningModuleStatusOfUserByGeneratedIdInSessionV2(
  generatedId: string,
) {
  const email = getPlayerEmailByGenerateId(generatedId);
  const completedAdvacedModulesKeys =
    getAdvancedLearningModuleKeysListByGenerateIdInSessionV2(generatedId);
  const advancedModuleKeysLst =
    getLearningModuleKeysAdvancedLocationsInListByEmail(email);
  if (
    completedAdvacedModulesKeys &&
    compareArrays(completedAdvacedModulesKeys, advancedModuleKeysLst)
  ) {
    return getTeamManagementStatus(MemberTraningStatus.COMPLETED);
  } else {
    return getTeamManagementStatus(MemberTraningStatus.IN_PROGRESS);
  }
}

function getBasicLearningModuleStatusOfUserByGeneratedIdInSessionV2(
  generatedId: string,
) {
  const email = getPlayerEmailByGenerateId(generatedId);
  const completedBasicModulesKeys =
    getBasicLearningModuleKeysListByGeneratedIdInSessionV2(generatedId);
  const moduleKeysLst = getLearningModuleKeysLocationsInListByEmail(email);
  if (
    completedBasicModulesKeys &&
    compareArrays(completedBasicModulesKeys.sort(), moduleKeysLst.sort())
  ) {
    return getTeamManagementStatus(MemberTraningStatus.COMPLETED);
  } else {
    return getTeamManagementStatus(MemberTraningStatus.IN_PROGRESS);
  }
}

export function getLearningModulesStatusOfUserByGeneratedIdInSessionV2(
  generatedId: string,
) {
  if (isThereManagerLevelByGenerateId(generatedId)) {
    return getAdvancedLearningModuleStatusOfUserByGeneratedIdInSessionV2(
      generatedId,
    );
  } else {
    return getBasicLearningModuleStatusOfUserByGeneratedIdInSessionV2(
      generatedId,
    );
  }
}

function getSessionV2UpdatedAtFieldOfTheLearingModuleKey(
  sessionData: any,
  moduleKey: string,
) {
  let updatedAt = '';
  if (sessionData.learningModuleKey == moduleKey) {
    updatedAt = sessionData.updatedAt.$date;
  }
  return updatedAt;
}

export function calculateLearningModulesDataOfUserFromTrainindModuleByGenerateIdInSessionV2(
  generatedId: string,
  traingModule: Map<string, string[]>,
) {
  const sessions = filterSessionsV2DataByGeneratedId(generatedId);
  const email = getPlayerEmailByGenerateId(generatedId);
  const idClean = getPlayerIdCleanByGenerateId(generatedId);
  const statusModule =
    getLearningModulesStatusOfUserByGeneratedIdInSessionV2(generatedId);
  const completedModules =
    calculateNumberOfCompletedModulesForUserByEmail(email);

  let moduleResultMap = new Map<string, any>();
  moduleResultMap.set(TrainingReportColumn.EMPLOYEE_ID, idClean);
  moduleResultMap.set(TrainingReportColumn.STATUS, statusModule);
  moduleResultMap.set(
    TrainingReportColumn.NUMBER_OF_COMPLETED_MODULE,
    completedModules,
  );

  for (const session of sessions) {
    const trainingContent = getTrainingContentsByProgramIdAndMarket(
      session.appId,
      session.market,
    );
    const learningModuleKeys = filterValuesByKeyInMap(
      traingModule,
      session.appId,
    );
    let updatedAt = '';
    for (const moduleKey of learningModuleKeys) {
      updatedAt = getSessionV2UpdatedAtFieldOfTheLearingModuleKey(
        session,
        moduleKey,
      );
      const moduleName =
        getLearningModuleNameByLearningModuleKeyFromTrainingData(
          trainingContent,
          moduleKey,
        );
      moduleResultMap.set(moduleName, converStringDateToStringDate(updatedAt));
    }
  }
  return Object.fromEntries(moduleResultMap);
}
