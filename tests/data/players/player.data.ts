import { environment as ENV } from '../../../utils/environment.util';
import * as util from 'util';
import { PLAYERS_DATA_TEST_PATH } from '../../../constants';
import { getEnumEnvironment } from '../../../enums';
import { isThereManagerLevel, readJsonFile } from '../../../utils';

function getPlayerDataPath() {
  const env = ENV.TEST_ENVIRONMENT;
  return util.format(PLAYERS_DATA_TEST_PATH, getEnumEnvironment(env));
}

const PLAYERS_DATA = readJsonFile(getPlayerDataPath());

function filterPlayersDataByEmail(email: string) {
  return PLAYERS_DATA.filter((player: any) => player.email == email);
}

function filterPlayersDataByGenerateId(generatedId: string) {
  return PLAYERS_DATA.filter(
    (player: any) => player.generatedId == generatedId,
  );
}

export function getPlayerGeneratedIdByEmail(email: string) {
  let generatedId;
  const playerData = filterPlayersDataByEmail(email);
  if (playerData.length > 0) {
    generatedId = playerData[0].generatedId;
  }
  return generatedId;
}

export function getPlayerEmailByGenerateId(generatedId: string) {
  let email;
  const playerData = filterPlayersDataByGenerateId(generatedId);
  if (playerData.length > 0) {
    email = playerData[0].email;
  }
  return email;
}

export function getPlayerJobLevelByEmail(email: string) {
  let jobLevel;
  const playerData = filterPlayersDataByEmail(email);
  if (playerData.length > 0) {
    jobLevel = playerData[0].jobLevel;
  }
  return jobLevel;
}

export function getPlayerJobLevelByGenerateId(generatedId: string) {
  let jobLevel;
  const playerData = filterPlayersDataByGenerateId(generatedId);
  if (playerData.length > 0) {
    jobLevel = playerData[0].jobLevel;
  }
  return jobLevel;
}

export function getPlayerIdCleanByEmail(email: string) {
  let idClean;
  const playerData = filterPlayersDataByEmail(email);
  if (playerData.length > 0) {
    idClean = playerData[0].idClean;
  }
  return idClean;
}

export function getPlayerIdCleanByGenerateId(generateId: string) {
  let idClean;
  const playerData = filterPlayersDataByGenerateId(generateId);
  if (playerData.length > 0) {
    idClean = playerData[0].idClean;
  }
  return idClean;
}

export function isThereManagerLevelByEmail(email: string) {
  const jobLevel = getPlayerJobLevelByEmail(email);
  return isThereManagerLevel(jobLevel);
}

export function isThereManagerLevelByGenerateId(generatedId: string) {
  const jobLevel = getPlayerJobLevelByGenerateId(generatedId);
  return isThereManagerLevel(jobLevel);
}
