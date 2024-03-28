import { expect, test } from '@playwright/test';
import { extractString } from '../../../utils';
import { REGEX_ANY_WORD_CHARACTERS } from '../../../constants';
import { sendNewLearningCode } from '../../../services';

test.describe('New learning code service test', () => {
  test('@C0001: Verify receiving learning code has 6-word characters', async () => {
    const response = await sendNewLearningCode();
    // Verify service is sent successfully
    expect(response.status()).toBe(200);
    const responseBody = response.text();
    expect(responseBody).toBeTruthy();
    expect(
      extractString(await responseBody, REGEX_ANY_WORD_CHARACTERS)?.length,
    ).toBe(6);
  });
});
