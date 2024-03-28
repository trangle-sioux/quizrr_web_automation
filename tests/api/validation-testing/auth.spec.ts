import { expect, test } from '@playwright/test';
import { UserRole } from '../../../enums';
import {
  assignExistingEmailForSendOtpRequest,
  nonExistingEmailAddressList,
} from '../../data';
import {
  EmailChecking,
  delay,
  generateRandomNumericString,
  getRandomItemInList,
} from '../../../utils';
import { sendAuth, sendAuthByOtpCode } from '../../../services/auth.service';
import { sendOtpToEmail } from '../../../services';

// Run in serial mode to avoid conflict using existing email address
// TODO: resolve this when start implement API tcs
test.describe.configure({ mode: 'serial' });
let validEmail: string;
const nonExistingEmail: string = getRandomItemInList(
  nonExistingEmailAddressList,
);
const randomOtpCode = generateRandomNumericString(6);
let correctOtpCode: string;

test.beforeAll('send OTP service to get correct OTP code', async () => {
  validEmail = assignExistingEmailForSendOtpRequest(UserRole.ACCOUNT_OWNER);
  const response = await sendOtpToEmail(validEmail);
  expect(response.status()).toBe(200);

  // Must add the waiting period to ensure receiving the new mail (the same receiver and received time as the previous one)
  await delay(3000);
  correctOtpCode = await EmailChecking.getOtpCodeFromEmail(validEmail);
});

test('@C001: send auth service failed with an invalid otp code', async () => {
  const response = await sendAuthByOtpCode(randomOtpCode, validEmail);

  // Verify service is sent failed
  expect(response.status()).toBe(401);
});

test('@C002: send auth service failed with an invalid email', async () => {
  const response = await sendAuthByOtpCode(correctOtpCode, nonExistingEmail);

  // Verify service is sent failed
  expect(response.status()).toBe(401);
});

test('@C003: send auth service failed with an invalid strategy', async () => {
  const response = await sendAuth(correctOtpCode, validEmail, 'opt');

  // Verify service is sent failed
  expect(response.status()).toBe(401);
});

test('@C004: send auth service failed when inputting empty values', async () => {
  const response = await sendAuthByOtpCode('', '');

  // Verify service is sent failed
  expect(response.status()).toBe(401);
});
