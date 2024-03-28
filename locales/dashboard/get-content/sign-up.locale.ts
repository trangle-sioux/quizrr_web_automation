import { Platforms } from '../../../enums/platform.enum';
import { readLocalesJsonFile } from '../../../utils/json/json-locales.util';
import { Languages } from '../../languages.locale';

function getSignUpContent(languageTag?: string) {
  const lang = Languages.getLanguageAbbreviationOf(languageTag);
  const objectData = readLocalesJsonFile(Platforms.DASHBOARD, lang, 'sign_up');
  return objectData;
}

export function getResendVerificationCodeText(languageTag?: string) {
  const object = getSignUpContent(languageTag);
  return object.verification.resend_verification_code;
}

export function getSendVerificationCodeSuccess(languageTag?: string) {
  const object = getSignUpContent(languageTag);
  return object.verification.send_verification_code_success;
}

export function getErrorCode409(languageTag?: string) {
  const object = getSignUpContent(languageTag);
  return object.error_codes[409];
}

export function getVerificationTitle(languageTag?: string) {
  const verifcationObject = getSignUpContent(languageTag);
  return verifcationObject.verification.title;
}

export function getCreateFacilityTeamTitle(languageTag?: string) {
  const createFacilityObject = getSignUpContent(languageTag);
  return createFacilityObject.create_facility_team.title;
}

export function getInviteMembersTitle(languageTag?: string) {
  const createFacilityObject = getSignUpContent(languageTag);
  return createFacilityObject.invite_members.title;
}

export function getFinishTitle(languageTag?: string) {
  const objectData = getSignUpContent(languageTag);
  return objectData.finish.title;
}

export function getFinishStartTraining(languageTag?: string) {
  const objectData = getSignUpContent(languageTag);
  return objectData.finish.start_training;
}

export function getInviteMembersByEmail(languageTag?: string) {
  const objectData = getSignUpContent(languageTag);
  return objectData.invite_members.by_email;
}

export function getInviteMembersByNonEmail(languageTag?: string) {
  const objectData = getSignUpContent(languageTag);
  return objectData.invite_members.by_non_email;
}

export function getInviteMembersInviteByEmail(languageTag?: string) {
  const objectData = getSignUpContent(languageTag);
  return objectData.invite_members.invite_by_email;
}

export function getInviteMembersInviteLink(languageTag?: string) {
  const objectData = getSignUpContent(languageTag);
  return objectData.invite_members.invite_link;
}

export function getInviteMembersInviteNonEmailLink(languageTag?: string) {
  const objectData = getSignUpContent(languageTag);
  return objectData.invite_members.invite_non_email_link;
}

export function getInviteMembersRolesPlayer(languageTag?: string) {
  const objectData = getSignUpContent(languageTag);
  return objectData.invite_members.roles.player;
}
