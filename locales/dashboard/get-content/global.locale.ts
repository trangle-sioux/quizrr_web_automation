import { Platforms } from '../../../enums/platform.enum';
import { readLocalesJsonFile } from '../../../utils/json/json-locales.util';
import { Languages } from '../../languages.locale';

function getGlobalContent(languageTag?: string) {
  const lang = Languages.getLanguageAbbreviationOf(languageTag);
  const objectData = readLocalesJsonFile(Platforms.DASHBOARD, lang, 'global');
  return objectData;
}

// =================== "team_management" ===================

export function getTeamManagementInformationEditOrganization(
  languageTag?: string,
) {
  const objectData = getGlobalContent(languageTag);
  return objectData.team_management.information.edit_organization;
}

export function getTeamManagementInformationGetReport(languageTag?: string) {
  const objectData = getGlobalContent(languageTag);
  return objectData.team_management.information.get_report;
}

export function getTeamManagementTabTitlesYourDashboardUsers(
  languageTag?: string,
) {
  const objectData = getGlobalContent(languageTag);
  return objectData.team_management.tab_titles.your_dashboard_users;
}

export function getTeamManagementTabTitlesYourColleagues(languageTag?: string) {
  const objectData = getGlobalContent(languageTag);
  return objectData.team_management.tab_titles.your_colleagues;
}

export function getTeamManagementMemberTitle(languageTag?: string) {
  const objectData = getGlobalContent(languageTag);
  return objectData.team_management.member_title;
}

export function getTeamManagementStatus(
  statusKey: string,
  languageTag?: string,
) {
  const objectData = getGlobalContent(languageTag);
  return objectData.team_management.status[statusKey];
}

export function getTeamManagementWithKeys(key: string, languageTag?: string) {
  const objectData = getGlobalContent(languageTag);
  return objectData.team_management[key];
}

export function getTeamManagementRole(key: string, languageTag?: string) {
  const objectData = getGlobalContent(languageTag);
  return objectData.team_management.role[key];
}

export function getTeamManagementInformationSelectTime(languageTag?: string) {
  const objectData = getGlobalContent(languageTag);
  return objectData.team_management.information.select_time;
}
// =================== "facility_info" ===================

export function getFacilityInfoTitle(languageTag?: string) {
  const objectData = getGlobalContent(languageTag);
  return objectData.facility_info.title;
}
