import { environment as ENV } from '../../../utils/environment.util';
import * as util from 'util';
import { FACILITY_TEAMS_DATA_TEST_PATH } from '../../../constants';
import { getEnumEnvironment } from '../../../enums';
import { readJsonFile } from '../../../utils';

function getFacilityTeamsPath() {
  const env = ENV.TEST_ENVIRONMENT;
  return util.format(FACILITY_TEAMS_DATA_TEST_PATH, getEnumEnvironment(env));
}

const FACILITY_TEAMS_DATA = readJsonFile(getFacilityTeamsPath());

function filterFacilityTeamDataById(id: string) {
  return FACILITY_TEAMS_DATA.filter((facility: any) => facility._id.$oid == id);
}

export function getFacilityTeamNameById(facilityId: string) {
  const facility = filterFacilityTeamDataById(facilityId);
  return facility[0].name;
}
