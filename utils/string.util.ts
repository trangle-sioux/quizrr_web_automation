import { REGEX_NUMBER } from '../constants/regex.constant';

export function extractNumberFromString(inputString: string) {
  return extractString(inputString, REGEX_NUMBER);
}

export function ciEquals(a: any, b: any) {
  return typeof a === 'string' && typeof b === 'string'
    ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
    : a === b;
}

export function getRandomItemInList(arr: any[]) {
  const random = Math.floor(Math.random() * arr.length);
  return arr[random];
}

export function extractString(inputString: string, regex: RegExp) {
  // Using match with regEx
  let matches = RegExp(regex).exec(inputString);
  if (matches) {
    return matches[1];
  }
}

export function getRandomItem(set: Iterable<unknown> | ArrayLike<unknown>) {
  let items = Array.from(set);
  return items[Math.floor(Math.random() * items.length)];
}

export function generateRandomNumericString(length: number): string {
  const numbers = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result += numbers[randomIndex];
  }
  return result;
}

export function doesStringMatchRegex(str: string, regex: RegExp) {
  return regex.test(str);
}

export function filterValuesByKeyInMap(
  mapData: Map<string, string[]>,
  keyData: string,
) {
  let result: string[] = [];
  mapData.forEach((v, k) => {
    if (k == keyData) {
      result = v;
    }
  });
  return result;
}
