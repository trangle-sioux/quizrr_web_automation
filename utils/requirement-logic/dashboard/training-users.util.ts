import { MemberTraningStatus } from '../../../enums';
import { getTeamManagementStatus } from '../../../locales';
import {
  getLearningModuleKeysListByGeneratedIdInSessionV2,
  getLearningModulesStatusOfUserByGeneratedIdInSessionV2,
  getPlayerGeneratedIdByEmail,
  getUserIsVerified,
} from '../../../tests/data';

/**
There are 4 types of the user training status
  1. Invite Pending: the user who has received invite email but has not registered an account yet
  2. Not Started: the user registered an account but hasn't started training yet
  3. In-Progress: the user registered an account and is in the process of the training
  4. Completed: the user registered an account and completed the training process 
    - advanced training level: the user has to complete all advanced training levels
    - basic training lelel: the user has to complete all basic training levels
 */

export function calculateTrainingStatusOfUserByEmail(email: string) {
  const isVerified = getUserIsVerified(email);
  if (!isVerified) {
    return getTeamManagementStatus(MemberTraningStatus.INVITE_PENDING);
  } else {
    const generatedId = getPlayerGeneratedIdByEmail(email);
    let status: string = getTeamManagementStatus(
      MemberTraningStatus.NOT_STARTED,
    );
    if (generatedId) {
      status =
        getLearningModulesStatusOfUserByGeneratedIdInSessionV2(generatedId);
    }
    return status;
  }
}

/**
- The user hasn't resgistered account => the completed the learning module is 0
- The number completed the learning module is the number of the learning module that the user completed in the session collection data
 */

export function calculateNumberOfCompletedModulesForUserByEmail(email: string) {
  const isVerified = getUserIsVerified(email);
  const generatedId = getPlayerGeneratedIdByEmail(email);
  if (!isVerified) {
    return 0;
  } else {
    return getLearningModuleKeysListByGeneratedIdInSessionV2(generatedId)
      .length;
  }
}
