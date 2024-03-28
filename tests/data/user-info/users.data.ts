import {
  environment as ENV,
  readJsonFile,
  ciEquals,
  getRandomItemInList,
  extractNumberFromString,
  calculateNumberOfCompletedModulesForUserByEmail,
} from '../../../utils';
import { test } from '@playwright/test';
import * as util from 'util';
import { USER_DATA_TEST_PATH } from '../../../constants';
import {
  ProjectName,
  UserRole,
  UserDataType,
  getEnumEnvironment,
  AccountRole,
} from '../../../enums';
import { getTeamManagementRole } from '../../../locales/dashboard/get-content';
import { getPlayerGeneratedIdByEmail } from '../players/player.data';
import { getFacilityTeamNameById } from '../facility-teams/facility-team.data';

type AccountsFragment = {
  _id: { $oid: string };
  role: string;
  team?: { $oid: string };
};

type UsersFragment = {
  email: string;
  role: string;
  accounts: AccountsFragment[];
  isVerified?: boolean;
};

function getUsersDataPath() {
  const env = ENV.TEST_ENVIRONMENT;
  return util.format(USER_DATA_TEST_PATH, getEnumEnvironment(env));
}

function readUsersDataJsonFile(userDataType?: string) {
  let type: string = userDataType ?? UserDataType.STATIC;
  let jsonObject = readJsonFile(getUsersDataPath());
  jsonObject = jsonObject[type];
  return jsonObject;
}

export function getAllUsersByRole(userRole: string, userDataType?: string) {
  const usersData = readUsersDataJsonFile(userDataType);
  const sizeUsersData = usersData.length;
  let lstUsersData = [];
  for (let i = 0; i < sizeUsersData; i++) {
    if (ciEquals(usersData[i].role, userRole)) {
      lstUsersData.push(usersData[i]);
    }
  }
  return lstUsersData;
}

function getKeysObjectsByUniqueEmailAddress(email: string) {
  const usersObj = readJsonFile(getUsersDataPath());
  let keysObject: string = '';
  const keys: string[] = Object.keys(usersObj);
  for (let index in keys) {
    const userObjectOfKey = readUsersDataJsonFile(keys[index]);
    const userData: string[] = userObjectOfKey.filter(
      (objectData: UsersFragment) => ciEquals(objectData.email, email),
    );
    if (userData.length > 0) {
      keysObject = keys[index];
      break;
    }
  }
  return keysObject;
}

function getUserDataByEmail(email: string) {
  const usersObj = readJsonFile(getUsersDataPath());
  let userData = [];
  const keys: string[] = Object.keys(usersObj);
  for (let index in keys) {
    const userObjectOfKey = readUsersDataJsonFile(keys[index]);
    userData = userObjectOfKey.filter((objectData: UsersFragment) =>
      ciEquals(objectData.email, email),
    );
    if (userData.length > 0) {
      break;
    }
  }
  return userData[0];
}

export function getUserAccountId(email: string) {
  const userData: UsersFragment = getUserDataByEmail(email);
  return userData.accounts[0]._id.$oid;
}

function getUserAccountsRole(email: string) {
  const userData: UsersFragment = getUserDataByEmail(email);
  return userData.accounts[0].role;
}

export function getUserAccountTeamId(email: string) {
  const userData: UsersFragment = getUserDataByEmail(email);
  return userData.accounts[0].team?.$oid;
}

function getRandomEmailUserData(userRole: string, userDataType?: string) {
  const lstUsersData = getAllUsersByRole(userRole, userDataType);
  const userData: { email: string } = getRandomItemInList(lstUsersData);
  return userData.email;
}

export function getRandomOwnerEmailAccount(userDataType?: string) {
  return getRandomEmailUserData(UserRole.ACCOUNT_OWNER, userDataType);
}

function getAllUsersDataBelongingToTheOwnerEmail(ownerEmail: string) {
  const accountId: string = getUserAccountId(ownerEmail);
  const keysObject: string = getKeysObjectsByUniqueEmailAddress(ownerEmail);
  const usersData = readUsersDataJsonFile(keysObject);
  return usersData.filter(
    (user: UsersFragment) => user.accounts[0]._id.$oid == accountId,
  );
}

function getAllAdminDataFromUserObject(userObject: any) {
  return userObject.filter(
    (user: UsersFragment) => user.accounts[0].role == AccountRole.TEAM_ADMIN,
  );
}

function getAllAdminDataBelongingToTheOwnerEmail(ownerEmail: string) {
  const usersData = getAllUsersDataBelongingToTheOwnerEmail(ownerEmail);
  return getAllAdminDataFromUserObject(usersData);
}

function getAllPlayersDataOfAdminBelongingToOwnerEmail(ownerEmail: string) {
  let mapAdminPlayers = new Map<string, UsersFragment[]>();
  const usersObj = getAllUsersDataBelongingToTheOwnerEmail(ownerEmail);
  const adminObj = getAllAdminDataFromUserObject(usersObj);
  for (let index in adminObj) {
    const adminData = adminObj[index];
    const adminEmail = adminData.email;
    let adminPlayer;
    const teamAccount = adminData.accounts[0];
    if (teamAccount.team !== undefined) {
      const teamId = teamAccount.team.$oid;
      adminPlayer = usersObj.filter(
        (user: UsersFragment) =>
          user.role == UserRole.ACCOUNT_PLAYER &&
          user.accounts[0].team?.$oid == teamId,
      );
    }
    mapAdminPlayers.set(adminEmail, adminPlayer);
  }
  return mapAdminPlayers;
}

function getAllUsersDataBelongingToTheOwnerEmailWithoutAdminPlayers(
  ownerEmail: string,
) {
  const mapAdminPlayers: Map<string, UsersFragment[]> =
    getAllPlayersDataOfAdminBelongingToOwnerEmail(ownerEmail);
  const usersData = getAllUsersDataBelongingToTheOwnerEmail(ownerEmail);
  for (let entry of mapAdminPlayers.entries()) {
    const lstAdminPlayers = entry[1];
    if (lstAdminPlayers) {
      for (let idx in lstAdminPlayers) {
        usersData.splice(
          usersData.findIndex(
            (user: UsersFragment) => user.email === lstAdminPlayers[idx].email,
          ),
          1,
        );
      }
    }
  }
  return usersData;
}

export function getAllUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
  ownerEmail: string,
) {
  const usersData =
    getAllUsersDataBelongingToTheOwnerEmailWithoutAdminPlayers(ownerEmail);
  const emailsLst: string[] = [];
  for (let idx in usersData) {
    emailsLst.push(usersData[idx].email);
  }
  return emailsLst;
}

export function getAllUsersTrainingEmailAddressBelongingToTheOwnerEmail(
  ownerEmail: string,
) {
  const usersData = getAllUsersDataBelongingToTheOwnerEmail(ownerEmail);
  const emailsLst: string[] = [];
  for (let idx in usersData) {
    const email = usersData[idx].email;
    const generatedId = getPlayerGeneratedIdByEmail(email);
    if (generatedId) {
      const completedModule =
        calculateNumberOfCompletedModulesForUserByEmail(email);
      if (completedModule > 0) {
        emailsLst.push(email);
      }
    }
  }
  return emailsLst;
}

export function getAllAdminEmailAddressBelongToTheOwnerEmail(
  ownerEmail: string,
) {
  const adminData = getAllAdminDataBelongingToTheOwnerEmail(ownerEmail);
  const emailsLst: string[] = [];
  for (let idx in adminData) {
    emailsLst.push(adminData[idx].email);
  }
  return emailsLst;
}

export function getAllAdminEmailAdressThatHasSubMembersBelongingToTheOwnerEmail(
  ownerEmail: string,
) {
  const adminEmailsLst =
    getAllAdminEmailAddressBelongToTheOwnerEmail(ownerEmail);
  const emailsLst: string[] = [];
  for (const email of adminEmailsLst) {
    if (doesAdminAccountHasSubMembers(ownerEmail, email)) {
      emailsLst.push(email);
    }
  }
  return emailsLst;
}

export function getRandomAdminEmailAddressThatHasSubTeamMembersBelongingToTheOwnerEmail(
  ownerEmail: string,
) {
  const adminEmailLst =
    getAllAdminEmailAdressThatHasSubMembersBelongingToTheOwnerEmail(ownerEmail);
  return getRandomItemInList(adminEmailLst);
}

export function getPlayersOfAdminEmailBelongingToTheOwnerAccount(
  ownerEmail: string,
  adminEmail: string,
) {
  const mapData = getAllPlayersDataOfAdminBelongingToOwnerEmail(ownerEmail);
  let players: UsersFragment[] = [];
  for (const [key, value] of mapData.entries()) {
    if (key == adminEmail) {
      players = value;
    }
  }
  return players;
}

export function countPlayersOfAdminEmailBelongingToTheOwnerAccount(
  ownerEmail: string,
  adminEmail: string,
) {
  const players = getPlayersOfAdminEmailBelongingToTheOwnerAccount(
    ownerEmail,
    adminEmail,
  );
  return players ? players.length : 0;
}

export function doesAdminAccountHasSubMembers(
  ownerEmail: string,
  adminEmail: string,
) {
  const numOfPlayers = countPlayersOfAdminEmailBelongingToTheOwnerAccount(
    ownerEmail,
    adminEmail,
  );
  return numOfPlayers > 0;
}

export function getAllInvitePendingUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
  ownerEmail: string,
) {
  const invitePendingUsersEmailLst: string[] = [];
  const emailUsers =
    getAllUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
      ownerEmail,
    );
  for (const email of emailUsers) {
    const isVerified = getUserIsVerified(email);
    if (!isVerified) {
      invitePendingUsersEmailLst.push(email);
    }
  }
  return invitePendingUsersEmailLst;
}

export function getAllNotStartedUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
  ownerEmail: string,
) {
  const notStartedUsersEmailLst: string[] = [];
  const emailUsers =
    getAllUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
      ownerEmail,
    );
  for (const email of emailUsers) {
    const isVerified = getUserIsVerified(email);
    const completedModule =
      calculateNumberOfCompletedModulesForUserByEmail(email);
    if (isVerified && completedModule == 0) {
      notStartedUsersEmailLst.push(email);
    }
  }
  return notStartedUsersEmailLst;
}

export function getUserIsVerified(email: string) {
  const userData: UsersFragment = getUserDataByEmail(email);
  return userData.isVerified;
}

export function getUserPermissions(email: string) {
  let accountRole: string = getUserAccountsRole(email);
  if (ciEquals(accountRole, AccountRole.TEAM_ADMIN)) {
    accountRole = UserRole.TEAM_ADMIN;
  }
  return getTeamManagementRole(accountRole);
}

export function getUserTeamName(email: string) {
  const teamAdminId = getUserAccountTeamId(email);
  let teamName = '';
  if (teamAdminId) {
    teamName = getFacilityTeamNameById(teamAdminId);
  }
  return teamName;
}

function assignExistingEmailAddress(userRole: string, userDataType: string) {
  const projectName = test.info().project.name;
  const users = getAllUsersByRole(userRole, userDataType);
  let emailAddress = '';
  switch (projectName) {
    case ProjectName.WEBKIT:
      emailAddress =
        users[1]?.email || ENV.TESTING_QUIZRR_EMPLOYEE_EMAIL_ADDRESS;
      break;
    case ProjectName.FIREFOX:
      emailAddress =
        users[2]?.email || ENV.TESTING_QUIZRR_EMPLOYEE_EMAIL_ADDRESS;
      break;
    case ProjectName.EMULATOR_PIXEL_5:
      emailAddress =
        users[3]?.email || ENV.TESTING_QUIZRR_EMPLOYEE_EMAIL_ADDRESS;
      break;
    case ProjectName.SIMULATOR_IPHONE_12:
      emailAddress =
        users[4]?.email || ENV.TESTING_QUIZRR_EMPLOYEE_EMAIL_ADDRESS;
      break;
    default:
      emailAddress =
        users[0]?.email || ENV.TESTING_QUIZRR_EMPLOYEE_EMAIL_ADDRESS;
      break;
  }
  return emailAddress;
}

export function assignEmailAddressFromExistingUsersToEachProject(
  userRole: string,
  userDataType: string,
) {
  return assignExistingEmailAddress(userRole, userDataType);
}

export function assignExistingEmailForSendOtpRequest(userRole: string) {
  const staticUsers = getAllUsersByRole(userRole, UserDataType.STATIC);
  const testCaseId = extractNumberFromString(test.info().title);
  let emailAddress = '';
  switch (testCaseId) {
    case '01':
      emailAddress = staticUsers[1]?.email || '';
      break;
    case '001':
      emailAddress = staticUsers[2]?.email || '';
      break;
    case '00001':
      emailAddress = staticUsers[3]?.email || '';
      break;
    default:
      emailAddress = staticUsers[0]?.email || '';
      break;
  }
  return emailAddress;
}
