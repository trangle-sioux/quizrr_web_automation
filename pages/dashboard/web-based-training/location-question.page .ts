import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';
import {
  getAccessedLearningModuleKeyFromCache,
  getQuestionsWithCorrectTrainingModuleLevel,
  getAccessedTokenFromCache,
  cacheAccessedLearningModuleKey,
  removeAccessedLearningModuleKeyInCache,
  addLearningScoreForAnsweringCorrectOnFirstTry,
} from '../../../utils';
import {
  getLearningModuleKeyByTokenAndModuleOrder,
  getQuestionTextByToken,
} from '../../../tests/data/training-content/training-content.data';
import { Languages, getQuestionResponseCorrectFirst } from '../../../locales';
import { trainingContentLocations } from '../../../interfaces';
import { LocationsType } from '../../../enums';
import { WAIT_IN_10_SECOND } from '../../../constants';

export class WebBasedLocationQuestionPage extends WebBasedTrainingBasePage {
  private readonly questionTxt: Locator;
  private readonly correctAnswerOpt: Locator;
  private readonly wrongAnswerOpt: Locator;
  private readonly questionNextBtn: Locator;
  private readonly submitBtn: Locator;
  private readonly confirmBtn: Locator;
  private readonly correctAnswerOnFirstTryMsg: Locator;
  private readonly playVideoBtn: Locator;
  private readonly movieNextBtn: Locator;
  private readonly quitTrainingBtn: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.questionTxt = this.webBasedTrainingFrame.getByTestId(
      'LocationQuestion-text',
    );
    this.correctAnswerOpt = this.webBasedTrainingFrame.getByTestId(
      'LocationQuestion-true-answer',
    );
    this.wrongAnswerOpt = this.webBasedTrainingFrame.getByTestId(
      'LocationQuestion-false-answer',
    );
    this.questionNextBtn = this.webBasedTrainingFrame.getByTestId(
      'LocationQuestion-nextButton',
    );
    this.submitBtn = this.webBasedTrainingFrame.getByTestId(
      'LocationQuestion-submitButton',
    );
    this.confirmBtn = this.webBasedTrainingFrame.getByTestId(
      'LocationQuestion-confirmButton',
    );
    this.correctAnswerOnFirstTryMsg = this.webBasedTrainingFrame.getByText(
      getQuestionResponseCorrectFirst(),
    );
    this.playVideoBtn = this.webBasedTrainingFrame.getByTestId('VideoPlayer');
    this.movieNextBtn = this.webBasedTrainingFrame.getByTestId(
      'LocationMovie-nextButton',
    );
    this.quitTrainingBtn = this.webBasedTrainingFrame.getByTestId(
      'Training-GamePlay-quitButton',
    );
  }

  // ========================= ACTIONS ========================

  async chooseCorrectAnswer() {
    await this.correctAnswerOpt.click();
  }

  async clickOnSubmitButton() {
    await this.submitBtn.click();
  }

  async clickOnQuestionNextButton() {
    await this.questionNextBtn.click();
  }
  async clickOnMovieNextButton() {
    await this.movieNextBtn.click();
  }

  async clickOnOkButton() {
    await this.confirmBtn.click();
  }

  async clickOnPlayVideoButton() {
    await this.playVideoBtn.click();
  }

  async quitCurrentTraining() {
    // TODO: the bug appear on developer build for browser: https://sioux.atlassian.net/browse/QTD-4539
    // Remove after can run in a offical build
    await this.quitTrainingBtn.click();
    await super.acceptWindowDialog();
    await this.quitTrainingBtn.click();
    await super.acceptWindowDialog();
    removeAccessedLearningModuleKeyInCache();
  }

  // Watching video in 10s
  async completeWatchingAMovie(watchVideo: boolean, inMillisecond?: number) {
    const watchingTime = inMillisecond ?? WAIT_IN_10_SECOND;
    if (watchVideo) {
      await this.clickOnPlayVideoButton();
      this.page.waitForTimeout(watchingTime);
    }
    await this.clickOnMovieNextButton();
  }

  async submitCorrectAnswer(
    token: string,
    questionKey: string,
    abbreviation?: string,
  ) {
    let questionText = getQuestionTextByToken(token, questionKey, abbreviation);
    // Wait for load dom completing and the question displaying before answering
    await this.page.waitForLoadState();
    await expect(this.questionTxt).toHaveText(questionText);
    await this.chooseCorrectAnswer();
    await this.clickOnSubmitButton();
  }

  async answerQuestionCorrectInFirstTry(
    token: string,
    moduleKey: string,
    questionKey: string,
    abbreviation?: string,
  ) {
    await this.submitCorrectAnswer(token, questionKey, abbreviation);

    // Cache the score of training module to verify later
    if (await this.correctAnswerOnFirstTryMsg.isVisible()) {
      addLearningScoreForAnsweringCorrectOnFirstTry(moduleKey);
    }
    await this.clickOnOkButton();
    await this.clickOnQuestionNextButton();
  }

  async answerTheRangeOfQuestionsWithCorrectAnswers(
    token: string,
    moduleKey: string,
    fromQuestionOrder?: number,
    toQuestionOrder?: number,
    watchMovies?: boolean,
    abbreviation?: string,
  ) {
    const questions: trainingContentLocations[] =
      getQuestionsWithCorrectTrainingModuleLevel(token, moduleKey);

    const from = fromQuestionOrder ?? 1;
    const to = toQuestionOrder ?? questions.length;
    const watchVideo = watchMovies ?? false;
    for (let i = from; i <= to; i++) {
      // Watch video for movie and answer for question
      let questionKey = questions[i - 1].key;
      let questionType = questions[i - 1].type;
      if (questionType == LocationsType.MOVIE) {
        await this.completeWatchingAMovie(watchVideo);
      } else {
        await this.answerQuestionCorrectInFirstTry(
          token,
          moduleKey,
          questionKey,
          abbreviation,
        );
      }
    }
  }

  /**
   * Answer some question of current learning module to a specified question order
   * Skip watching video
   * @param toOrder: question order. e.x: toOrder = 3. Answer from question 1 to question 3
   * @param languageNameInEnglish: training in a non-english language
   */
  async answerQuestionsWithCorrectAnswersToQuestionOrder(
    toOrder: number,
    languageNameInEnglish?: string,
  ) {
    const token = getAccessedTokenFromCache();
    const moduleKey = getAccessedLearningModuleKeyFromCache();
    const abbreviation = Languages.getLanguageAbbreviationOf(
      languageNameInEnglish,
    );
    await this.answerTheRangeOfQuestionsWithCorrectAnswers(
      token,
      moduleKey,
      undefined,
      toOrder,
      undefined,
      abbreviation,
    );
  }

  /**
   * Answer learning module from specified question
   * Skip watching video
   * Need to re-cache the LearningModuleKey.ACCESSED_LEARNING_MODULE_KEY for the re-accessed module
   * It was cleared after quit the module.
   * @param moduleOrder: the re-accessed module order
   * @param fromOrder: begining question order to answer. E.x: fromOrder = 3: answer from question 3 to the end
   * @param languageNameInEnglish: training in a non-english language
   */
  async continueAnsweringRemainingQuestionsOfModuleOrder(
    moduleOrder: number,
    fromOrder: number,
    languageNameInEnglish?: string,
  ) {
    const token = getAccessedTokenFromCache();
    const moduleKey = getLearningModuleKeyByTokenAndModuleOrder(
      token,
      moduleOrder,
    );
    cacheAccessedLearningModuleKey(moduleKey);
    const abbreviation = Languages.getLanguageAbbreviationOf(
      languageNameInEnglish,
    );
    await this.answerTheRangeOfQuestionsWithCorrectAnswers(
      token,
      moduleKey,
      fromOrder,
      undefined,
      undefined,
      abbreviation,
    );
  }

  /**
   * Answer all questions of the learning module.
   * Answer from question 1 to the end.
   * @param watchVideo: false for skipping watching video
   * @param moduleOrder: optional. Get specified module if defined, else get moduleKey from the cache
   * @param languageNameInEnglish: training in a non-english language
   */
  async answerAllQuestionsWithCorrectAnswers(
    watchVideo: boolean,
    moduleOrder?: number,
    languageNameInEnglish?: string,
  ) {
    const token = getAccessedTokenFromCache();
    let moduleKey = this.getCorespondingModuleKeyByModuleOrder(
      token,
      moduleOrder,
    );
    const abbreviation = Languages.getLanguageAbbreviationOf(
      languageNameInEnglish,
    );
    await this.answerTheRangeOfQuestionsWithCorrectAnswers(
      token,
      moduleKey,
      undefined,
      undefined,
      watchVideo,
      abbreviation,
    );
  }

  async answerAllQuestionCorrectAndWatchingVideo(
    moduleOrder?: number,
    languageNameInEnglish?: string,
  ) {
    await this.answerAllQuestionsWithCorrectAnswers(
      true,
      moduleOrder,
      languageNameInEnglish,
    );
  }

  async answerAllQuestionCorrect(
    moduleOrder?: number,
    languageNameInEnglish?: string,
  ) {
    await this.answerAllQuestionsWithCorrectAnswers(
      false,
      moduleOrder,
      languageNameInEnglish,
    );
  }

  /**
   * Get specified module if defined, else get moduleKey from the cache
   * @param token
   * @param moduleOrder
   * @returns moduleKey: string
   */
  getCorespondingModuleKeyByModuleOrder(
    token: string,
    moduleOrder?: number,
  ): string {
    let moduleKey = '';
    if (moduleOrder !== undefined) {
      moduleKey = getLearningModuleKeyByTokenAndModuleOrder(token, moduleOrder);
      cacheAccessedLearningModuleKey(moduleKey);
    } else {
      moduleKey = getAccessedLearningModuleKeyFromCache();
    }
    return moduleKey;
  }

  // ========================= VERIFY ========================
}
