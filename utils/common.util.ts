import { APIResponse } from '@playwright/test';
import { getUnixEpochTime } from './datetime.util';
import { extractString } from './string.util';
import { REGEX_DASHBOARD_URL_PREFIX } from '../constants';
import { Environments } from '../enums';

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateOrganizationName(project: string) {
  return 'OrganizationName' + project + getUnixEpochTime();
}

export function generateTeamName(project: string) {
  return 'TeamName' + project + getUnixEpochTime();
}

export async function parseApiResponseToJsonObject(response: APIResponse) {
  return JSON.parse(await response.text());
}

export function getTestingEnvironmentViaUrl(url: string) {
  const env = extractString(url, REGEX_DASHBOARD_URL_PREFIX);
  switch (env) {
    case 'staging':
      return Environments.STAGING;
    case 'dev':
      return Environments.DEVELOP;
    default:
      return Environments.PRODUCTION;
  }
}

export function compareArrays(array1: any, array2: any) {
  return JSON.stringify(array1) === JSON.stringify(array2);
}

export function sortArrayObjectByKeys(arrayObject: any[]) {
  const keys = Object.keys(arrayObject[0]);
  keys.sort();
  const sortedArray = arrayObject.map(obj => {
    const sortedObj: any = {};
    keys.forEach(key => {
      sortedObj[key] = obj[key];
    });
    return sortedObj;
  });

  return sortedArray;
}

export function sortArrayObjectBySpecificKey(array: any[], sortBy: string) {
  // Use the sort method with a custom comparison function
  array.sort((a, b) => {
    // Compare the name properties of two Person objects
    return a[sortBy].localeCompare(b[sortBy]);
  });
  return array;
}

export function generateRandomAPlayerIdNumber(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/&- ';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
