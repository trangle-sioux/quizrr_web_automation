import { request } from '@playwright/test';
import { environment as ENV } from '../../utils';
import { SEND_OTP_URL } from '../../constants';
import { HeadersKey, HeadersValue, PayloadKey } from '../../enums';

/**
 * Note: If you send this request in different test files,
 *  ensure these emails are different
 * since it overrides the OTP code sent to emails while running the tests in parallel
 */
export async function sendOtpToEmail(emailAdrress: string) {
  const formData = new URLSearchParams();
  formData.append(PayloadKey.EMAIL, emailAdrress);
  return (await request.newContext()).post(SEND_OTP_URL, {
    ignoreHTTPSErrors: true,
    headers: {
      [HeadersKey.X_API_KEY]: ENV.X_API_KEY,
      [HeadersKey.CONTENT_TYPE]: HeadersValue.CONTENT_TYPE_FORM_URLENCODED,
    },
    data: formData.toString(),
  });
}
