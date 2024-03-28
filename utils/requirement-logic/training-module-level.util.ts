/**
Training module level logic: depends on 2 elements: 
 - the selected job level
 - the "locations" section, and the "advanced_locations" section in the corresponding training module content.

Job level is classified as: 
 Advanced: Manager, Mid-Manager, and Recruiter. (For group training cases, all players must have selected these advanced job levels)
 Basic: Remaining jobs.

The training module level is categorized:
 Advanced: the job level is advanced and there is an "advanced_locations" section.
 Hidden: the job level is basic and there is NO "locations" section. (disappear from the dashboard after input profile(s)).
 Basic: remaining case.
 */

import { JobLevelKey } from '../../enums/profile/job-level.enum';
import { WorkTypeKey } from '../../enums/profile/work-type.enum';
import { TrainingModuleLevel } from '../../enums/web-based-training/training-module.enum';
import { trainingContentLocations } from '../../interfaces';
import {
  getJobLevelManager,
  getJobLevelMidManager,
  getWorkTypeRecruiter,
} from '../../locales';
import {
  getAdvancedLocationsByToken,
  getLocationsByToken,
} from '../../tests/data/training-content/training-content.data';
import { getSelectedJobsFromCache } from '../cache.util';

const advancedJobs = [
  getJobLevelManager(),
  getJobLevelMidManager(),
  getWorkTypeRecruiter(),
];

function isAdvancedJobLevel() {
  const selectedJobs = getSelectedJobsFromCache();
  return selectedJobs.every(selectedJob => advancedJobs.includes(selectedJob));
}

export function isThereManagerLevel(jobLevel: any) {
  let result: boolean = false;
  const advancedLevel = [
    JobLevelKey.MANAGER,
    JobLevelKey.MANAGEMENT,
    JobLevelKey.MID_MANAGER,
    JobLevelKey.MANAGEMENT,
    JobLevelKey.RECRUITMENT_STAFF,
    WorkTypeKey.RECRUITER,
    WorkTypeKey.MANAGER_HR_SUPERVISOR,
  ];
  if (advancedLevel.includes(jobLevel)) {
    result = true;
  }
  return result;
}

function isThereTheLocationsInModuleContent(
  token: string,
  moduleKey: string,
  isAdvancedLocation: boolean,
) {
  const locations = isAdvancedLocation
    ? getAdvancedLocationsByToken(token, moduleKey)
    : getLocationsByToken(token, moduleKey);

  // Make sure the location is existed and is not empty
  return locations !== undefined && Object.keys(locations).length > 0;
}

export function getTrainingModuleLevel(token: string, moduleKey: string) {
  const advancedJobLevel = isAdvancedJobLevel();
  const haveLocations = isThereTheLocationsInModuleContent(
    token,
    moduleKey,
    false,
  );
  const haveAdvancedLocations = isThereTheLocationsInModuleContent(
    token,
    moduleKey,
    true,
  );
  if (advancedJobLevel && haveAdvancedLocations) {
    return TrainingModuleLevel.ADVANCED;
  } else if (!advancedJobLevel && !haveLocations) {
    return TrainingModuleLevel.HIDDEN;
  } else {
    return TrainingModuleLevel.BASIC;
  }
}

export function getQuestionsWithCorrectTrainingModuleLevel(
  token: string,
  moduleKey: string,
): trainingContentLocations[] {
  const trainingModuleLevel = getTrainingModuleLevel(token, moduleKey);
  switch (trainingModuleLevel) {
    case TrainingModuleLevel.ADVANCED:
      return getAdvancedLocationsByToken(token, moduleKey);
    case TrainingModuleLevel.BASIC:
      return getLocationsByToken(token, moduleKey);
    default:
      // Return empty for hidden module
      return [];
  }
}
