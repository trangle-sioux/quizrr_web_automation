/**
Go next module logic when clicking on the "Continue to next module" button on the Congratulations page: 
 - If the next module is not hidden: go next module
 - If the next module is hidden: skip next module, go to second next module.
*/

import { TrainingModuleLevel } from '../../enums/web-based-training/training-module.enum';
import { getLearningModuleKeysByToken } from '../../tests/data/training-content/training-content.data';
import {
  getAccessedLearningModuleKeyFromCache,
  getAccessedTokenFromCache,
} from '../cache.util';
import { ValidationError } from '../errors/validation.error.util';
import { getTrainingModuleLevel } from './training-module-level.util';

export function getTheNextModuleKey(): string {
  const token = getAccessedTokenFromCache();
  const moduleKeys = getLearningModuleKeysByToken(token);
  let nextModuleKey = '';
  const currentModuleKey = getAccessedLearningModuleKeyFromCache();
  for (const [index, moduleKey] of moduleKeys.entries()) {
    if (currentModuleKey == moduleKey) {
      nextModuleKey = moduleKeys[index + 1];
      const nextModuleLevel = getTrainingModuleLevel(token, nextModuleKey);
      return nextModuleLevel !== TrainingModuleLevel.HIDDEN
        ? nextModuleKey
        : moduleKeys[index + 2];
    }
  }
  throw new ValidationError(
    `The current module key: ${currentModuleKey} is NOT matched any training module keys. Please verify again.`,
  );
}
