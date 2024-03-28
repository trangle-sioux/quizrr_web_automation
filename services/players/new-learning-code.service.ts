import { request } from '@playwright/test';
import { environment as ENV } from '../../utils';
import { NEW_LEARNING_CODE_URL } from '../../constants';
import { HeadersKey } from '../../enums';

export async function sendNewLearningCode() {
  return (await request.newContext()).get(NEW_LEARNING_CODE_URL, {
    headers: {
      [HeadersKey.X_API_KEY]: ENV.X_API_KEY,
    },
  });
}
