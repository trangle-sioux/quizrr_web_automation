import { expect, test } from '@playwright/test';
import { sendOtpToEmail } from '../../../services';
import { UserRole } from '../../../enums';
import {
  assignExistingEmailForSendOtpRequest,
  nonExistingEmailAddressList,
} from '../../data';
import {
  getRandomItemInList,
  parseApiResponseToJsonObject,
} from '../../../utils';

test.describe.configure({ mode: 'serial' });
let validEmail: string;
const nonExistingEmail: string = getRandomItemInList(
  nonExistingEmailAddressList,
);

test.beforeAll('assign valis email', async () => {
  validEmail = assignExistingEmailForSendOtpRequest(UserRole.ACCOUNT_OWNER);
});

test('@C00001: send OTP code successfully with the valid email address', async () => {
  const response = await sendOtpToEmail(validEmail);

  // Verify service is sent successfully
  expect(response.status()).toBe(200);
});

test('@C00002: send OTP code failed with the invalid email address', async () => {
  const response = await sendOtpToEmail(nonExistingEmail);

  // Verify service is sent failed
  expect(response.status()).toBe(404);
});

test('@C00003: send OTP code failed with the empty email address', async () => {
  const response = await sendOtpToEmail('');

  // Verify service is sent failed with "Missing email" message
  expect(response.status()).toBe(400);
  const responseBody = await parseApiResponseToJsonObject(response);
  expect(responseBody.message).toBe('Missing email');
});
