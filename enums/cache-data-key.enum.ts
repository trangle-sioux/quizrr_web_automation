export enum DateTimeKey {
  SEND_OTP_CODE_EMAIL = 'cacheTimeWhenOtpEmailIsSent',
  SEND_INVITE_EMAIL = 'cacheTimeWhenInviteEmailIsSent',
}

export enum LinkKey {
  INVITE_BY_LINK = 'cacheLinkOfInviteByLink',
}

export enum FacilityInfoKey {
  SELECT_MARKET = 'cacheSelectedMarketValue',
  SELECT_REGION = 'cacheSelectedRegionValue',
  SELECT_NUMBER_OF_EMPLOYEES = 'cacheSelectedNumberOfEmployeeValue',
  ENTER_ORGANIZATION_NAME = 'cacheEnteredOrganizationNameValue',
  NUMBER_OF_EMPLOYEES = 'cacheNumberOfEmployeeValue',
}

export enum OtpCodeTypeKey {
  OLD_OTP_CODE = 'cacheOldOtpCode',
  NEW_OTP_CODE = 'cacheNewOtpCode',
  // Cache when get otp is sent to email in EmailChecking
  OTP_CODE = 'cacheOtpCode',
}

export enum FilePathKey {
  REPORT_DOWNLOADED_FILE_PATH = 'cacheFilePathOfReportDownloaded',
}

export enum NewEmailAddressKey {
  OWNER = 'cacheNewOwnerEmailAddressKey',
}

export enum TokenKey {
  ACCESSED_TOKEN = 'cacheAccessTokenKey',
}

export enum LearningModuleKey {
  ACCESSED_LEARNING_MODULE_KEY = 'cacheAccessModuleKey',
  MODULE_COMPLETED_TIMES_OF = 'cacheModuleCompletedTimesOf_%s',
}

export enum JobTypeKey {
  JOB_TYPE = 'cacheSelectedJobType',
}
