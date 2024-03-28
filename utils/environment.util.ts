import { resolve } from 'path';
import 'dotenv/config';

export const environment = {
  DASHBOARD_URL: process.env.DASHBOARD_URL!,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING!,
  DB_QUIZRR_NAME: process.env.DB_QUIZRR_NAME!,
  GMAIL_CREDENTIALS: resolve('./utils/gmail/gmail-credentials.json'),
  GMAIL_TOKEN: resolve('./utils/gmail/gmail-token.json'),
  TESTING_EMAIL_ADDRESS_1: process.env.TESTING_EMAIL_ADDRESS_1!,
  TESTING_QUIZRR_EMPLOYEE_EMAIL_ADDRESS:
    process.env.TESTING_QUIZRR_EMPLOYEE_EMAIL_ADDRESS!,
  SIGN_UP_TOKEN_OWNER_ACC_1: process.env.SIGN_UP_TOKEN_OWNER_ACC_1!,
  INVITE_TOKEN_PLAYER_ACC_1: process.env.INVITE_TOKEN_PLAYER_ACC_1!,
  NO_REPLY_QUIZRR_MAIL: process.env.NO_REPLY_QUIZRR_MAIL!,
  TEST_ENVIRONMENT: process.env.TEST_ENVIRONMENT,
  PARALLEL_RUN_INDEX: process.env.CIRCLE_NODE_INDEX ?? '0',

  // ========= Testrail ===========
  TESTRAIL_DOMAIN: process.env.TESTRAIL_DOMAIN!,
  TESTRAIL_USERNAME: process.env.TESTRAIL_USERNAME!,
  TESTRAIL_APIKEY: process.env.TESTRAIL_APIKEY!,
  TESTRAIL_TESTRUN_IDS: process.env.TESTRAIL_TESTRUN_IDS!,

  // ========= API Endpoit =========
  SERVICE_WRITE_BASE_URL: process.env.SERVICE_WRITE_BASE_URL!,
  SERVICE_READ_BASE_URL: process.env.SERVICE_READ_BASE_URL!,
  STAGING_SERVICE_WRITE_BASE_URL: process.env.STAGING_SERVICE_WRITE_BASE_URL!,
  X_API_KEY: process.env.X_API_KEY!,
};
