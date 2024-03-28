import { GenderOption, JobTypeOption, ProfileElement } from '../enums';

export class manufacturingFullIdWithSearchableCountries {
  public static profileElements: string[] = [
    ProfileElement.GENDER.toString(),
    ProfileElement.DATE_OF_BIRTH.toString(),
    ProfileElement.JOB_TYPE.toString(),
    ProfileElement.ID_NUMBER.toString(),
    ProfileElement.HOME_COUNTRY.toString(),
  ];

  public static genderOptions: string[] = [
    GenderOption.MALE.text,
    GenderOption.FEMALE.text,
    GenderOption.OTHER.text,
  ];

  public static jobTypeOptions: string[] = [
    JobTypeOption.PRODUCTION_WORKER.text,
    JobTypeOption.MANAGER.text,
    JobTypeOption.MID_MANAGER.text,
  ];

  // Leave empty value for the select home country setting.
  // Add home country options for choose home country setting.
  public static homeCountryOptions: string[] = [];
}
