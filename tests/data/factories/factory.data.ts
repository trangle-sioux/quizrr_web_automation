import { environment as ENV } from '../../../utils/environment.util';
import * as util from 'util';
import { FACTORIES_DATA_TEST_PATH } from '../../../constants';
import { getEnumEnvironment } from '../../../enums';
import { ciEquals, readJsonFile } from '../../../utils';
import { getUserAccountId } from '../user-info/users.data';
import { getAccountFactoryId } from '../accounts/account.data';
import { generateRangeOfEmployeesFromANumber } from '../employees.data';

function getFactoryDataPath() {
  const env = ENV.TEST_ENVIRONMENT;
  return util.format(FACTORIES_DATA_TEST_PATH, getEnumEnvironment(env));
}

const FACTORY_DATA = readJsonFile(getFactoryDataPath());

function getFactoryData(factoryId: string) {
  let factoryObject = FACTORY_DATA.filter((factory: any) =>
    ciEquals(factory._id.$oid, factoryId),
  );
  return factoryObject[0];
}

function getFactoryName(factoryId: string) {
  const factoryData = getFactoryData(factoryId);
  return factoryData.name;
}

export function getFactoryNameByUserEmailAddress(email: string) {
  const accountId: string = getUserAccountId(email);
  const factoryId: string = getAccountFactoryId(accountId);
  return getFactoryName(factoryId);
}

export function getFactoryMarketId(factoryId: string) {
  const factoryData = getFactoryData(factoryId);
  return factoryData.market.$oid;
}

function getFactoryTeamSize(factoryId: string) {
  const factoryData = getFactoryData(factoryId);
  return factoryData.teamSize;
}

export function getFactoryTeamSizeByUserEmailAddress(email: string) {
  const accountId: string = getUserAccountId(email);
  const factoryId: string = getAccountFactoryId(accountId);
  const teamSize: number = getFactoryTeamSize(factoryId);
  return generateRangeOfEmployeesFromANumber(teamSize);
}
