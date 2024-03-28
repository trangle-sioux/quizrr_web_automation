import { Platforms } from '../../enums/platform.enum';
import { readLocalesJsonFile } from '../../utils/json/json-locales.util';
import { Languages } from '../languages.locale';

function getAppContent(languageTag?: string) {
  const lang = Languages.getLanguageAbbreviationOf(languageTag);
  const objectData = readLocalesJsonFile(Platforms.APP_CONTENT, lang);
  return objectData;
}

export function getJobLevel(jobLevelKey: string, languageTag?: string) {
  const objectData = getAppContent(languageTag);
  return objectData.job_level[jobLevelKey];
}

export function getWorkType(workerTypeKey: string, languageTag?: string) {
  const objectData = getAppContent(languageTag);
  return objectData.work_type[workerTypeKey];
}

// =========== "player_setup" section ===========
export function getPrivacyTitle(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.player_setup.privacy_title;
}

export function getPlayerSetupJobLevelLabel(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.player_setup.job_level_label;
}

export function getPlayerSetupGenderLabel(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.player_setup.gender_label;
}

export function getPlayerSetupYearOfBirthLabel(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.player_setup.year_of_birth_label;
}

export function getPlayerSetupCountryLabel(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.player_setup.country_label;
}

export function getPlayerSetupDateOfBirthLabel(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.player_setup.date_of_birth_label;
}

export function getPlayerSetupIdLabel(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.player_setup.id_label;
}

// =========== "gender" section ===========
export function getGenderFemale(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.gender.female;
}

export function getGenderMale(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.gender.male;
}

export function getGenderOther(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.gender.other;
}

// =========== "job_level" section ===========
export function getJobLevelWorker(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.job_level.worker;
}

export function getJobLevelManager(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.job_level.manager;
}

export function getJobLevelMidManager(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.job_level['mid-manager'];
}

// =========== "work_type" section ===========
export function getWorkTypeRecruiter(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.work_type.recruiter;
}

// =========== "market" section ===========

export function getMarketWithKeyAs(marketKey: string, languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.market[marketKey];
}

// =========== "baseline" section ===========
export function getBaselineIntro(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.baseline.intro;
}

export function getBaselineLetGo(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.baseline.lets_go;
}

// =========== "game_complete" section ===========
export function getGameCompletedTitle(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.game_complete.title;
}

export function getGameCompletedSubTitle(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.game_complete.subtitle;
}

export function getGameCompletedEntireTrainingCompleted(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.game_complete.entire_training_completed;
}

export function getGameCompletedCloseThisPage(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.game_complete.close_this_page;
}

export function getGameCompletedYourResultTitle(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.game_complete.your_results_title;
}

export function getGameCompletedContinueToNextModule(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.game_complete.continue_to_next_module;
}

export function getGameCompletedViewTrainingResult(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.game_complete.view_training_result;
}

// =========== "question" section ===========
export function getQuestionResponseCorrectFirst(languageTag?: string) {
  const content = getAppContent(languageTag);
  return content.question.response_correct_first;
}
