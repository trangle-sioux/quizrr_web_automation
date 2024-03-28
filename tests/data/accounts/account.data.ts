import { environment as ENV } from '../../../utils/environment.util';
import * as util from 'util';
import { ACCOUNTS_DATA_TEST_PATH } from '../../../constants';
import { getEnumEnvironment } from '../../../enums';
import { readJsonFile } from '../../../utils';

function getAccountDataPath() {
  const env = ENV.TEST_ENVIRONMENT;
  return util.format(ACCOUNTS_DATA_TEST_PATH, getEnumEnvironment(env));
}

const ACCOUNTS_DATA = readJsonFile(getAccountDataPath());

function filterAccountsByAccountId(accountId: string) {
  return ACCOUNTS_DATA.filter((account: any) => account._id.$oid == accountId);
}

export function getAccountFactoryId(accountId: string) {
  let factoryId;
  const accounts = filterAccountsByAccountId(accountId);
  if (accounts.length > 0) {
    factoryId = accounts[0].factories[0].$oid;
  }
  return factoryId;
}

export function getAccountAccessibleQRCodeId(accountId: string) {
  const accounts = filterAccountsByAccountId(accountId);
  let accessibleQRCodeId;
  if (accounts.length > 0 && accounts[0].accessibleQRCodes) {
    accessibleQRCodeId = accounts[0].accessibleQRCodes[0].$oid;
  }
  return accessibleQRCodeId;
}
