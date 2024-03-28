import { expect, test } from '@playwright/test';
import { EmailChecking, parseApiResponseToJsonObject } from '../../../utils';
import { UserRole } from '../../../enums';
import {
  assignExistingEmailForSendOtpRequest,
  readQueryUserContent,
  readQueryUserVariablesContent,
} from '../../data';
import { sendOtpToEmail } from '../../../services';
import { sendAuthByOtpCode } from '../../../services/auth.service';
import { sendGraphQl } from '../../../services/graphql.service';

test.describe("Sign-in's services", () => {
  let signInEmail: string;
  let accessToken: string;

  test.beforeAll('assign signInEmail', async () => {
    signInEmail = assignExistingEmailForSendOtpRequest(UserRole.ACCOUNT_OWNER);
  });

  test('@C01: Sign-in feature - Verify the services work correctly', async ({
    page,
  }) => {
    const sendOtpResponse = await sendOtpToEmail(signInEmail);

    // Verify the request is sent successfully
    expect(sendOtpResponse.status()).toBe(200);

    // wait to receive the newest email
    await page.waitForTimeout(3000);

    // Get correct OTP code via the mail
    const otpCode = await EmailChecking.getOtpCodeFromEmail(signInEmail);
    const sendAuthResponse = await sendAuthByOtpCode(otpCode, signInEmail);

    // Verify the request is sent successfully
    expect(sendAuthResponse.status()).toBe(201);
    const sendAuthResponseBody = await parseApiResponseToJsonObject(
      sendAuthResponse,
    );

    // Extract the access token to use in the GraphQL request
    accessToken = sendAuthResponseBody.accessToken;

    // Verify the return email should be the email address in the "send otp" request
    const userEmail = sendAuthResponseBody.user.email;
    expect(userEmail).toBe(signInEmail);

    const sendGraphQlResponse = await sendGraphQl(
      accessToken,
      readQueryUserContent(),
      readQueryUserVariablesContent(),
    );

    // Verify the request is sent successfully
    expect(sendGraphQlResponse.status()).toBe(200);
    const graphQlResponseBody = await parseApiResponseToJsonObject(
      sendGraphQlResponse,
    );

    // Verify the return email should be the email address in the "send otp" request
    expect(graphQlResponseBody.data.me.email).toBe(signInEmail);
  });
});
