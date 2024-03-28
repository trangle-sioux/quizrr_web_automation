import { request } from '@playwright/test';
import { environment as ENV } from '../utils';
import { AUTH_URL } from '../constants';
import { HeadersValue, HeadersKey, PayloadKey, PayloadValue } from '../enums';

export async function sendAuth(
  codeValue: string,
  emailValue: string,
  stratergy: string,
) {
  const formData = new URLSearchParams();
  formData.append(PayloadKey.CODE, codeValue);
  formData.append(PayloadKey.EMAIL, emailValue);
  formData.append(PayloadKey.STRATEGY, stratergy);
  return (await request.newContext()).post(AUTH_URL, {
    ignoreHTTPSErrors: true,
    headers: {
      [HeadersKey.X_API_KEY]: ENV.X_API_KEY,
      [HeadersKey.CONTENT_TYPE]: HeadersValue.CONTENT_TYPE_FORM_URLENCODED,
    },
    data: formData.toString(),
  });
}

export async function sendAuthByOtpCode(codeValue: string, emailValue: string) {
  return await sendAuth(codeValue, emailValue, PayloadValue.STRATEGY_OTP);
}

export async function sendAuthByAccessToken(accessTokenValue: string) {
  const formData = new URLSearchParams();
  formData.append(PayloadKey.ACCESS_TOKEN, accessTokenValue);
  formData.append(PayloadKey.STRATEGY, PayloadValue.STRATEGY_JWT);
  return (await request.newContext()).post(AUTH_URL, {
    ignoreHTTPSErrors: true,
    headers: {
      [HeadersKey.X_API_KEY]: ENV.X_API_KEY,
      [HeadersKey.CONTENT_TYPE]: HeadersValue.CONTENT_TYPE_FORM_URLENCODED,
    },
    data: formData.toString(),
  });
}
