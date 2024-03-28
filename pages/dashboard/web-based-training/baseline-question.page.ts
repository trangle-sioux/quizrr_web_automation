import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';
import {
  cacheAccessedLearningModuleKey,
  getAccessedLearningModuleKeyFromCache,
  getAccessedTokenFromCache,
} from '../../../utils';
import {
  getBaselineLocationsByToken,
  getLearningModuleKeyByTokenAndModuleOrder,
  getQuestionTextByToken,
} from '../../../tests/data/training-content/training-content.data';
import { Languages } from '../../../locales/languages.locale';
import { trainingContentLocations } from '../../../interfaces';

export class WebBasedBaselineQuestionPage extends WebBasedTrainingBasePage {
  private readonly questionTxt: Locator;
  private readonly correctAnswerOpt: Locator;
  private readonly wrongAnswerOpt: Locator;
  private readonly defaultAnswerOpt: Locator;
  private readonly submitBtn: Locator;
  private readonly questionOrderLbl: (questionOrder: number) => Locator;
  private readonly questionByTitleTxt: (questionTitle: string) => Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.questionTxt = this.webBasedTrainingFrame.getByTestId(
      'Survey-Question-text',
    );
    this.correctAnswerOpt = this.webBasedTrainingFrame.getByTestId(
      'Survey-Question-true-answer',
    );
    this.wrongAnswerOpt = this.webBasedTrainingFrame.getByTestId(
      'Survey-Question-false-answer',
    );
    this.defaultAnswerOpt = this.webBasedTrainingFrame.getByTestId(
      'Survey-Question-i_dont_know-answer',
    );
    this.submitBtn = this.webBasedTrainingFrame.getByTestId(
      'Survey-submitButton',
    );
    this.questionOrderLbl = (questionOrder: number) =>
      this.webBasedTrainingFrame.getByText(`${questionOrder} - Question`);
    this.questionByTitleTxt = (questionTitle: string) =>
      this.webBasedTrainingFrame.getByText(questionTitle);
  }

  // ========================= ACTIONS ========================

  async chooseCorrectAnswer() {
    await this.correctAnswerOpt.click();
  }

  async clickOnSubmitButton() {
    await this.submitBtn.click();
  }

  getLearningModuleKey(token: string, moduleOrder?: number): string {
    let moduleKey = '';
    if (moduleOrder !== undefined) {
      moduleKey = getLearningModuleKeyByTokenAndModuleOrder(token, moduleOrder);
      cacheAccessedLearningModuleKey(moduleKey);
    } else {
      moduleKey = getAccessedLearningModuleKeyFromCache();
    }
    return moduleKey;
  }

  async answerAllQuestionWithCorrectAnswers(
    moduleOrder?: number,
    languageNameInEnglish?: string,
  ) {
    const token = getAccessedTokenFromCache();
    let moduleKey = this.getLearningModuleKey(token, moduleOrder);
    const baselineQuestions: trainingContentLocations[] =
      getBaselineLocationsByToken(token, moduleKey);

    const abbreviation = Languages.getLanguageAbbreviationOf(
      languageNameInEnglish,
    );
    for (const [index, question] of baselineQuestions.entries()) {
      // Because of the animation, the new question slides from right to left after answering the question.
      // At this time, both old and new questions are displayed on the page with the same ID
      // Verify hiding the previous question
      if (index > 0) {
        await this.verifyTheQuestionTextShouldBeHidden(
          token,
          baselineQuestions[index - 1].key,
          abbreviation,
        );
      }

      // Verify displaying correct question before answering question
      await this.verifyTheQuestionTextShouldBeDisplayed(
        token,
        question.key,
        abbreviation,
      );

      // Answer question
      await this.chooseCorrectAnswer();
      await this.clickOnSubmitButton();
    }
  }

  // ========================= VERIFY ========================

  async verifyBaselineQuestionPageShouldBeDisplayed() {
    await expect(this.questionTxt).toBeVisible();
    await expect(this.defaultAnswerOpt).toBeVisible();
  }

  async verifyTheQuestionTextShouldBeDisplayed(
    token: string,
    questionKey: string,
    abbreviation?: string,
  ) {
    let questionText = getQuestionTextByToken(token, questionKey, abbreviation);
    await expect(this.questionByTitleTxt(questionText)).toBeVisible();
  }

  async verifyTheQuestionTextShouldBeHidden(
    token: string,
    questionKey: string,
    abbreviation?: string,
  ) {
    let questionText = getQuestionTextByToken(token, questionKey, abbreviation);
    await expect(this.questionByTitleTxt(questionText)).toBeHidden();
  }
}
