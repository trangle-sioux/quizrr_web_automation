import {
  JobTypeKey,
  LearningModuleKey,
  OtpCodeTypeKey,
  TokenKey,
} from '../enums';
import { EmailChecking } from './gmail/email-checking.util';
import * as util from 'util';

type Value<T> = T;

const cache = new Map<string, Value<any>>();

const arrayCache = new Map<string, Value<any>[]>();

export function getCache<T>(key: string): Value<T> {
  return cache.get(key) as Value<T>;
}

export function setCache<T>(key: string, value: Value<T>): Value<T> {
  cache.set(key, value);
  return value;
}

export function removeAnElementInCache(removedElementkey: string) {
  cache.delete(removedElementkey);
}

function setArrayValue<T>(key: string, value: Value<T>[]) {
  arrayCache.set(key, value);
}

function getArrayValue<T>(key: string): Value<T>[] | undefined {
  return arrayCache.get(key);
}

export function clearCache(): void {
  cache.clear();
}

export function clearArrayCache(): void {
  arrayCache.clear();
}

export async function cacheCurrentOtpCodeFromEmailAs(
  receiverEmail: string,
  otpCodeType: OtpCodeTypeKey,
) {
  const otpCode = await EmailChecking.getOtpCodeFromEmail(receiverEmail);
  setCache(otpCodeType, otpCode);
}

export function getOtpCodeFromCache(otpCodeType: OtpCodeTypeKey) {
  return getCache<string>(otpCodeType);
}

export function cacheAccessedToken(signUpToken: string) {
  setCache(TokenKey.ACCESSED_TOKEN, signUpToken);
}

export function getAccessedTokenFromCache() {
  return getCache<string>(TokenKey.ACCESSED_TOKEN);
}

export function cacheAccessedLearningModuleKey(moduleKey: string) {
  setCache(LearningModuleKey.ACCESSED_LEARNING_MODULE_KEY, moduleKey);
}

export function getAccessedLearningModuleKeyFromCache() {
  return getCache<string>(LearningModuleKey.ACCESSED_LEARNING_MODULE_KEY);
}

export function removeAccessedLearningModuleKeyInCache() {
  removeAnElementInCache(LearningModuleKey.ACCESSED_LEARNING_MODULE_KEY);
}

export function cacheLearningModuleScore(moduleKey: string, score: number) {
  setCache(moduleKey, score);
}

export function getLearningModuleScoreFromCache(moduleKey: string) {
  return getCache<number>(moduleKey) || 0;
}

export function cacheSelectedJobs(jobType: string) {
  if (arrayCache.has(JobTypeKey.JOB_TYPE)) {
    const existingJobs = arrayCache.get(JobTypeKey.JOB_TYPE) || [];
    arrayCache.set(JobTypeKey.JOB_TYPE, [...existingJobs, ...jobType]);
  } else {
    setArrayValue(JobTypeKey.JOB_TYPE, [jobType]);
  }
}

export function getSelectedJobsFromCache(): string[] {
  return getArrayValue<string>(JobTypeKey.JOB_TYPE) || [];
}

export function addCompletedModuleTimes(moduleKey: string) {
  const key = util.format(
    LearningModuleKey.MODULE_COMPLETED_TIMES_OF,
    moduleKey,
  );
  // check if the value is set
  let existingValue = getCache<number>(key);
  if (existingValue !== undefined) {
    setCache(key, existingValue + 1);
  } else {
    setCache(key, 1);
  }
}

export function getTheCompletedModuleTimes(moduleKey: string): number {
  return getCache<number>(
    util.format(LearningModuleKey.MODULE_COMPLETED_TIMES_OF, moduleKey),
  );
}
