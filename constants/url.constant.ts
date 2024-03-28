import {
  UrlSubdirectory as subdirectory,
  UrlPath as path,
  UrlParameterKey as parameter,
} from '../enums';
import { environment as ENV } from '../utils/environment.util';

// =============== URL ===============

export const OVERVIEW_PAGE_URL = `${ENV.DASHBOARD_URL}/${subdirectory.DASHBOARD_OVERVIEW}`;
export const SIGNUP_URL = `${ENV.DASHBOARD_URL}/${subdirectory.DASHBOARD_SIGN_UP}/?${parameter.SIGNUP_TOKEN}`;
export const SIGNUP_BY_INVITE_URL = `${ENV.DASHBOARD_URL}/${subdirectory.DASHBOARD_SIGN_UP}/?${parameter.INVITE_TOKEN}`;

// =============== API Endpoint ===============
export const SEND_OTP_URL: string = `${ENV.SERVICE_WRITE_BASE_URL}/${subdirectory.OTPS}/${path.SEND_OTP}`;
export const AUTH_URL: string = `${ENV.SERVICE_WRITE_BASE_URL}/${path.AUTH}`;
export const NEW_LEARNING_CODE_URL: string = `${ENV.STAGING_SERVICE_WRITE_BASE_URL}/${subdirectory.PLAYERS}/${path.NEW_LEARNING_CODE}`;

export const GRAPHQL_URL: string = `${ENV.SERVICE_READ_BASE_URL}/${path.GRAPH_QL}`;
