/**
Get training series content logic: depend on the below elements:
(refer this link for more details: https://sioux.atlassian.net/wiki/spaces/QUIZRR/pages/2389836206/Global+market+for+factory+s+qrCodes#Solution)
 - "feature_packages" collection: 
   + trainingIds
   + dynamicConfig
  
 - In the "qr_codes" collection:
   + "config.trainingSeriesList.programId"
   + "config.dynamicConfigUrl"
  
  Find the matched QR codes in the "qr_codes" collection with the values of the elements in the "feature_packages" collection:

  => No matched record found, get the global market for this trainingId 
  (AWS S3 >> Buckets >> inc.content >> global >> trainingId >> <latest_version> >> json file)

  => Matched record(s) found:
   + selected market in sign-up == "config.trainingSeriesList.market" in the record(s):
    => (AWS S3 >> Buckets >> inc.content >> <selected_market_in_sign-up> >> trainingId >> <latest_version> >> json file)
   + selected market in sign-up !== "config.trainingSeriesList.market" in the record(s):
    => (AWS S3 >> Buckets >> inc.content >> global >> trainingId >> <latest_version> >> json file)

Automation testing solution: Because we cannot connect to the DB to get and compare the elememts:
Sign-up case:
  => set trainingId, dynamicConfig stick with the token (sign-up or sign-in)
  => Set a valid market list for these above trainingId, dynamicConfig values
  => Compare the selected market in sign-up with these above valid markets
  => return corresponding the path to training content.
*/

import {
  FacilityInfoKey,
  HomeCountryOption,
  getHomeCountryOptionTestIdByText,
} from '../../enums';
import { DynamicConfig } from '../../enums/web-based-training/dynamic-config.enum';
import { TrainingId } from '../../enums/web-based-training/training-id.enum';
import { getCache } from '../cache.util';
import { environment as ENV } from '../environment.util';
import { switchCaseUndefined } from '../errors/throw-message.error.util';

const trainingIdKey = 'trainingId';
const dynamicCongigKey = 'dynamicConfig';

function getTheTrainingIdAndDynamicConfig(token: string): Map<string, string> {
  let trainingInfo = new Map<string, string>();
  switch (token) {
    case ENV.SIGN_UP_TOKEN_OWNER_ACC_1:
      trainingInfo.set(trainingIdKey, TrainingId.SIOUX_AUTOMATION_TEST);
      trainingInfo.set(
        dynamicCongigKey,
        DynamicConfig.MANUFACTURING_FULL_ID_WITH_SEARCHABLE_COUNTRIES,
      );
      break;
    default:
      throw switchCaseUndefined(token);
  }
  return trainingInfo;
}

function getValidTrainingMarkets(token: string): string[] {
  const trainingIdAndDynamicConfig = getTheTrainingIdAndDynamicConfig(token);
  let trainingId = trainingIdAndDynamicConfig.get(trainingIdKey);
  let dynamicConfig = trainingIdAndDynamicConfig.get(dynamicCongigKey);
  let validMarkets: string[] = [];
  if (trainingId == TrainingId.SIOUX_AUTOMATION_TEST) {
    if (
      dynamicConfig ==
      DynamicConfig.MANUFACTURING_FULL_ID_WITH_SEARCHABLE_COUNTRIES
    ) {
      validMarkets = [
        HomeCountryOption.THAILAND.text,
        HomeCountryOption.VIETNAM.text,
      ];
    }
  }
  return validMarkets;
}

function doesValidTrainingMarketsIncludeSelectedMarket(token: string) {
  const selectedMarket = getCache<string>(FacilityInfoKey.SELECT_MARKET);
  const validTrainingMarkets = getValidTrainingMarkets(token);
  return validTrainingMarkets.includes(selectedMarket);
}

export function getTrainingContentFolderPathByToken(token: string): string {
  const isSelectedMarketValid: boolean =
    doesValidTrainingMarketsIncludeSelectedMarket(token);
  const trainingInfo = getTheTrainingIdAndDynamicConfig(token);
  const trainingId = trainingInfo.get(trainingIdKey);
  const selectedMarket = getCache<string>(FacilityInfoKey.SELECT_MARKET);
  const marketFolderName = getHomeCountryOptionTestIdByText(selectedMarket);
  let folderPath: string = '';
  if (isSelectedMarketValid) {
    folderPath = `${trainingId}/${marketFolderName}`;
  } else {
    folderPath = `${trainingId}/global`;
  }
  return folderPath;
}
