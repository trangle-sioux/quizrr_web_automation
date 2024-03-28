import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';
import {
  addCompletedModuleTimes,
  getAccessedLearningModuleKeyFromCache,
  getAccessedTokenFromCache,
} from '../../../utils';
import {
  getPostTrainingLocationsByToken,
  getQuestionTextByToken,
} from '../../../tests/data/training-content/training-content.data';
import { trainingContentLocations } from '../../../interfaces';
import { WAIT_IN_10_SECOND } from '../../../constants';

export class WebBasedPostFeedbackPage extends WebBasedTrainingBasePage {
  private readonly questionTxt: Locator;
  private readonly smileEmojiIcon: Locator;
  private readonly sadEmojiIcon: Locator;
  private readonly submitBtn: Locator;
  private readonly LEARNED_SOMETHING_NEW_KEY: string =
    'i_learned_something_new';

  constructor(public readonly page: Page) {
    super(page);
    this.questionTxt = this.webBasedTrainingFrame.getByTestId(
      'Survey-Question-text',
    );
    this.smileEmojiIcon = this.webBasedTrainingFrame.getByTestId(
      'Survey-Question-true-emojiAnswer',
    );
    this.sadEmojiIcon = this.webBasedTrainingFrame.getByTestId(
      'Survey-Question-false-emojiAnswer',
    );
    this.submitBtn = this.webBasedTrainingFrame.getByTestId(
      'Survey-submitButton',
    );
  }

  // ========================= ACTIONS ========================

  async chooseSmileEmoji() {
    await expect(this.smileEmojiIcon).toBeEnabled({
      timeout: WAIT_IN_10_SECOND,
    });
    await this.smileEmojiIcon.click();
  }

  async clickOnSubmitButton() {
    await expect(this.submitBtn).toBeEnabled({
      timeout: WAIT_IN_10_SECOND,
    });
    await this.submitBtn.click();
  }

  async submitSmileEmojiOption() {
    await this.chooseSmileEmoji();
    await this.clickOnSubmitButton();
  }

  async answerAllQuestions(languageAbbreviation?: string) {
    const token = getAccessedTokenFromCache();
    const moduleKey = getAccessedLearningModuleKeyFromCache();
    const baselineQuestions: trainingContentLocations[] =
      getPostTrainingLocationsByToken(token, moduleKey);

    for (const question of baselineQuestions) {
      let questionKey = question.key;
      let questionText = getQuestionTextByToken(
        token,
        questionKey,
        languageAbbreviation,
      );
      await this.page.waitForLoadState();
      // Verify displaying correct question before answering question
      await expect(this.questionTxt).toHaveText(questionText);
      if (questionKey == this.LEARNED_SOMETHING_NEW_KEY) {
        await this.submitSmileEmojiOption();
      }
    }

    // After answer the post feedback question(s), this module is marked as completed 1 times
    addCompletedModuleTimes(moduleKey);
  }

  // ========================= VERIFY ========================
}
