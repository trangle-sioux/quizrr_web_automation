import {
  getPlayerSetupCountryLabel,
  getPlayerSetupJobLevelLabel,
  getPlayerSetupGenderLabel,
  getPlayerSetupYearOfBirthLabel,
  getPlayerSetupDateOfBirthLabel,
  getPlayerSetupIdLabel,
  getGenderFemale,
  getGenderMale,
  getGenderOther,
  getJobLevelWorker,
  getJobLevelManager,
  getJobLevelMidManager,
  getMarketWithKeyAs,
} from '../../locales';
import { validateReturnValueType } from '../../utils';

export enum ProfileElement {
  GENDER = getPlayerSetupGenderLabel(),
  YEAR_OF_BIRTH = getPlayerSetupYearOfBirthLabel(),
  JOB_TYPE = getPlayerSetupJobLevelLabel(),
  HOME_COUNTRY = getPlayerSetupCountryLabel(),
  DATE_OF_BIRTH = getPlayerSetupDateOfBirthLabel(),
  ID_NUMBER = getPlayerSetupIdLabel(),
}

type ProfileElementOption = {
  [key: string]: { text: string; testId: string };
};

export const GenderOption: ProfileElementOption = {
  MALE: {
    text: getGenderMale(),
    testId: getGenderMale().toLowerCase(),
  },
  FEMALE: {
    text: getGenderFemale(),
    testId: getGenderFemale().toLowerCase(),
  },
  OTHER: {
    text: getGenderOther(),
    testId: getGenderOther().toLowerCase(),
  },
};
export const JobTypeOption: ProfileElementOption = {
  PRODUCTION_WORKER: { text: getJobLevelWorker(), testId: 'worker' },
  MANAGER: {
    text: getJobLevelManager(),
    testId: getJobLevelManager().toLowerCase(),
  },
  MID_MANAGER: {
    text: getJobLevelMidManager(),
    testId: getJobLevelMidManager().toLowerCase(),
  },
};

export const HomeCountryOption: ProfileElementOption = {
  OTHER: { text: getMarketWithKeyAs('other'), testId: 'other' },
  TAIWAN: { text: getMarketWithKeyAs('taiwan'), testId: 'taiwan' },
  CAMBODIA: { text: getMarketWithKeyAs('cambodia'), testId: 'cambodia' },
  JORDAN: { text: getMarketWithKeyAs('jordan'), testId: 'jordan' },
  CHINA: { text: getMarketWithKeyAs('china'), testId: 'china' },
  MYANMAR: { text: getMarketWithKeyAs('myanmar'), testId: 'myanmar' },
  EGYPT: { text: getMarketWithKeyAs('egypt'), testId: 'egypt' },
  PHILIPPINES: {
    text: getMarketWithKeyAs('philippines'),
    testId: 'philippines',
  },
  MAURITUS: { text: getMarketWithKeyAs('mauritius'), testId: 'mauritius' },
  VIETNAM: { text: getMarketWithKeyAs('vietnam'), testId: 'vietnam' },
  THAILAND: { text: getMarketWithKeyAs('thailand'), testId: 'thailand' },
};

export function getGenderOptionTestIdByText(genderText: string) {
  const matchingOption = Object.values(GenderOption).find(
    option => option.text === genderText,
  );
  return validateReturnValueType(matchingOption).testId;
}

export function getJobTypeOptionTestIdByText(jobTypeText: string) {
  const matchingOption = Object.values(JobTypeOption).find(
    option => option.text === jobTypeText,
  );
  return validateReturnValueType(matchingOption).testId;
}

export function getHomeCountryOptionTestIdByText(homeCountryText: string) {
  const matchingOption = Object.values(HomeCountryOption).find(
    option => option.text === homeCountryText,
  );
  return validateReturnValueType(matchingOption).testId;
}

export function getHomeCountryOptionText(homeCountry: string) {
  const matchingOption = Object.values(HomeCountryOption).find(
    option => option.text === homeCountry || option.testId === homeCountry,
  );
  return validateReturnValueType(matchingOption).text;
}
