import { environment as ENV, switchCaseUndefined } from '../utils';
import { manufacturingFullIdWithSearchableCountries } from './manufacturing-full-id-with-searchable-countries.dynamic-config';

export class DynamicConfig {
  public static getProfileElementsByToken(token: string) {
    switch (token) {
      case ENV.SIGN_UP_TOKEN_OWNER_ACC_1:
        return manufacturingFullIdWithSearchableCountries.profileElements;
      default:
        switchCaseUndefined(token);
    }
  }

  public static getGenderOptionsByToken(token: string) {
    switch (token) {
      case ENV.SIGN_UP_TOKEN_OWNER_ACC_1:
        return manufacturingFullIdWithSearchableCountries.genderOptions;
      default:
        switchCaseUndefined(token);
    }
  }

  public static getJobTypeOptionsByToken(token: string) {
    switch (token) {
      case ENV.SIGN_UP_TOKEN_OWNER_ACC_1:
        return manufacturingFullIdWithSearchableCountries.jobTypeOptions;
      default:
        switchCaseUndefined(token);
    }
  }

  public static getHomeCountryOptionsByToken(token: string) {
    switch (token) {
      case ENV.SIGN_UP_TOKEN_OWNER_ACC_1:
        return manufacturingFullIdWithSearchableCountries.homeCountryOptions;
      default:
        switchCaseUndefined(token);
    }
  }
}
