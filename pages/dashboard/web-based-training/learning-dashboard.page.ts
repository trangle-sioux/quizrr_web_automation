import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';
import {
  cacheAccessedLearningModuleKey,
  getAccessedTokenFromCache,
  getLearningModuleAnswerRateText,
  getTheCompletedModuleTimes,
  getTotalTrainingToken,
} from '../../../utils';
import {
  getLearningModuleKeyByTokenAndModuleOrder,
  getLearningModuleKeysByToken,
  getTheTrainingSeriesNameByToken,
} from '../../../tests/data/training-content/training-content.data';
import { WAIT_IN_20_SECOND } from '../../../constants';

export class WebBasedLearningDashboardPage extends WebBasedTrainingBasePage {
  private readonly trainingSeriesNameLbl: Locator;
  private readonly learningModuleNameLbls: Locator;
  private readonly coinIcon: Locator;
  private readonly moduleCompletedStatsTxt: Locator;
  private readonly trainingTotalCoinTxt: Locator;
  private readonly learningModuleCoinTxt: (index: number) => Locator;
  private readonly completedSessionCountTxt: (moduleKey: string) => Locator;
  private readonly moduleProgressOrderIcon: (order: number) => Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.trainingSeriesNameLbl = this.webBasedTrainingFrame.getByTestId(
      'TrainingSeries-name',
    );
    this.learningModuleNameLbls = this.webBasedTrainingFrame.getByTestId(
      'LearningModuleItem-name',
    );
    this.coinIcon = this.webBasedTrainingFrame.getByTestId(
      'TrainingStats-coinImage',
    );
    this.moduleCompletedStatsTxt = this.webBasedTrainingFrame.getByTestId(
      'TrainingStats-completedSessions',
    );
    this.trainingTotalCoinTxt = this.webBasedTrainingFrame.getByTestId(
      'TrainingStats-totalCoins',
    );
    this.learningModuleCoinTxt = (index: number) =>
      this.webBasedTrainingFrame
        .getByTestId('LearningModuleItem-coins-icon')
        .nth(index);
    this.completedSessionCountTxt = (moduleKey: string) =>
      this.webBasedTrainingFrame.getByTestId(
        `LearningModuleItem-${moduleKey}-completedSessionsCount`,
      );
    this.moduleProgressOrderIcon = (order: number) =>
      this.webBasedTrainingFrame.getByTestId(
        `LearningModulesProgress-${order - 1}-progressButton`,
      );
  }

  // ========================= ACTIONS ========================

  async clickOnTheLearningModuleNumber(order: number) {
    await this.moduleProgressOrderIcon(order).click();
    await expect(this.learningModuleNameLbls.nth(order - 1)).toBeEnabled();
    await this.learningModuleNameLbls.nth(order - 1).click();
    const token = getAccessedTokenFromCache();
    const moduleKey = getLearningModuleKeyByTokenAndModuleOrder(token, order);
    cacheAccessedLearningModuleKey(moduleKey);
  }

  async clickOnTheFirstLearningModule() {
    await this.clickOnTheLearningModuleNumber(1);
  }

  // ========================= VERIFY ========================

  /**
   * The training series name should depend on the sign-up token
   */
  async verifyTheTrainingSeriesNameShouldBeDisplayedCorrectly() {
    const token = getAccessedTokenFromCache();
    const trainingSeriesName = getTheTrainingSeriesNameByToken(token);
    await expect(this.trainingSeriesNameLbl).toHaveText(trainingSeriesName, {
      timeout: WAIT_IN_20_SECOND,
    });
  }

  async verifyTheTrainingStatsCoinImageShouldBeDisplayed() {
    await expect(this.coinIcon).toBeVisible();
  }

  async verifyTheLearningDashboardShouldBeDisplayedCorrectly() {
    await this.verifyTheTrainingSeriesNameShouldBeDisplayedCorrectly();
    await this.verifyTheTrainingStatsCoinImageShouldBeDisplayed();
  }

  async verifyTheTrainingModulesCompletedStatsShouldBe(numberOfModule: number) {
    await expect(this.moduleCompletedStatsTxt).toHaveText(
      numberOfModule.toString(),
    );
  }

  async verifyTheTotalTrainingTokenShouldBeCorrect(token: string) {
    const actualTotalToken = getTotalTrainingToken(token, false);
    await expect(this.trainingTotalCoinTxt).toHaveText(
      `${actualTotalToken} Tokens`,
    );
  }

  async verifyTheCompletedModuleCountTextShouldBeDisplayedForModuleOrderAs(
    token: string,
    moduleOrder: number,
  ) {
    const moduleKey = getLearningModuleKeyByTokenAndModuleOrder(
      token,
      moduleOrder,
    );
    // Get time completed in cache
    const times = getTheCompletedModuleTimes(moduleKey);
    await expect(this.completedSessionCountTxt(moduleKey)).toHaveText(
      `Completed ${times} times.`,
    );
  }

  async verifyTheLearningModuleCoinTextShouldBeDisplayedCorrectForModuleOrder(
    token: string,
    moduleOrder: number,
  ) {
    const moduleKey = getLearningModuleKeyByTokenAndModuleOrder(
      token,
      moduleOrder,
    );
    const correctAnswerRate = getLearningModuleAnswerRateText(
      token,
      moduleKey,
      false,
    );
    await expect(this.learningModuleCoinTxt(moduleOrder - 1)).toHaveText(
      correctAnswerRate,
    );
  }

  async verifyTheDashboardShouldDisplayCorrectCompletedTrainingData() {
    const token = getAccessedTokenFromCache();
    await this.verifyTheTotalTrainingTokenShouldBeCorrect(token);
    const moduleKeys = getLearningModuleKeysByToken(token);
    for (let i = 1; i <= moduleKeys.length; i++) {
      // Verify module: `Completed ${times} times` text
      await this.verifyTheCompletedModuleCountTextShouldBeDisplayedForModuleOrderAs(
        token,
        i,
      );
      // Verify the token module rate
      await this.verifyTheLearningModuleCoinTextShouldBeDisplayedCorrectForModuleOrder(
        token,
        i,
      );
    }
  }
}
