/**
Training module score calculation logic:  
Each location question is answered correct in:
  - first time: add 2 points.
  - second time: add 1 points.
  - third time: add 0 points.

Only count location question with the "question" type.
Show in format: "<actual_score>/<max_score>" 
*/

import { LocationsType } from '../../enums/web-based-training/training-module.enum';
import { trainingContentLocations } from '../../interfaces';
import { getLearningModuleKeysByToken } from '../../tests/data/training-content/training-content.data';
import {
  cacheLearningModuleScore,
  getLearningModuleScoreFromCache,
} from '../cache.util';
import { getQuestionsWithCorrectTrainingModuleLevel } from './training-module-level.util';

export function addLearningScoreForAnsweringCorrectOnFirstTry(
  moduleKey: string,
) {
  let existingScore = getLearningModuleScoreFromCache(moduleKey);
  let newScore = existingScore + 2;
  cacheLearningModuleScore(moduleKey, newScore);
}

function getMaximumLearningModuleScore(
  token: string,
  moduleKey: string,
): number {
  let questions: trainingContentLocations[] =
    getQuestionsWithCorrectTrainingModuleLevel(token, moduleKey);
  let questionTypeLocations: trainingContentLocations[] = [];
  for (const question of questions) {
    let questionType = question.type;
    if (questionType == LocationsType.QUESTION) {
      questionTypeLocations.push(question);
    }
  }

  // maximum 2 scores for each question
  return questionTypeLocations.length * 2;
}

export function getLearningModuleAnswerRateText(
  token: string,
  moduleKey: string,
  areThereSpacesOnBothSidesOfSlash: boolean,
): string {
  const learningScore = getLearningModuleScoreFromCache(moduleKey);
  const maximumScore = getMaximumLearningModuleScore(token, moduleKey);
  return areThereSpacesOnBothSidesOfSlash
    ? `${learningScore} / ${maximumScore}`
    : `${learningScore}/${maximumScore}`;
}

export function getTotalTrainingToken(
  token: string,
  isMaximumToken: boolean,
): number {
  const moduleKeys = getLearningModuleKeysByToken(token);
  let totalToken = 0;
  for (const moduleKey of moduleKeys) {
    let moduleToken = isMaximumToken
      ? getMaximumLearningModuleScore(token, moduleKey)
      : getLearningModuleScoreFromCache(moduleKey);
    totalToken = totalToken + moduleToken;
  }
  return totalToken;
}

export function getTotalTrainingTokenRate(token: string): string {
  const actualToken = getTotalTrainingToken(token, false);
  const maxToken = getTotalTrainingToken(token, true);
  return `${actualToken} / ${maxToken}`;
}
