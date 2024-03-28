import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';
import {
  getGameCompletedCloseThisPage,
  getGameCompletedContinueToNextModule,
  getGameCompletedEntireTrainingCompleted,
  getGameCompletedSubTitle,
  getGameCompletedTitle,
  getGameCompletedViewTrainingResult,
  getGameCompletedYourResultTitle,
} from '../../../locales';
import {
  getLearningModuleKeysByToken,
  getLearningModuleNameByToken,
  getTheTrainingSeriesNameByToken,
} from '../../../tests/data/training-content/training-content.data';
import {
  cacheAccessedLearningModuleKey,
  getAccessedLearningModuleKeyFromCache,
  getAccessedTokenFromCache,
  getLearningModuleAnswerRateText,
  getTheNextModuleKey,
  getTotalTrainingTokenRate,
} from '../../../utils';

export class WebBasedCongratulationsPage extends WebBasedTrainingBasePage {
  // Displayed after completed a module
  private readonly moduleCompletedTitleTxt: Locator;
  private readonly moduleCompletedSubTitleTxt: Locator;
  private readonly moduleCompletedModuleNameLbl: Locator;
  private readonly moduleCompletedAnswerRateLbl: Locator;
  private readonly moduleCompletedGoNextModuleBtn: Locator;
  private readonly moduleCompletedViewResultBtn: Locator;

  // Displayed after completed the training
  private readonly trainingCompletedTitleTxt: Locator;
  private readonly trainingCompletedSubTitleTxt: Locator;
  private readonly trainingCompletedTrainingNameLbl: Locator;
  private readonly trainingCompletedYourResultsTitleTxt: Locator;
  private readonly trainingCompletedModuleNameLbls: Locator;
  private readonly trainingCompletedModuleAnswerRateLbls: Locator;
  private readonly trainingCompletedTotalAnswerRateLbl: Locator;
  private readonly trainingCompletedClosePageBtn: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.moduleCompletedTitleTxt = this.webBasedTrainingFrame.getByTestId(
      'Training-ModuleCompleted-title',
    );
    this.moduleCompletedSubTitleTxt = this.webBasedTrainingFrame.getByTestId(
      'Training-ModuleCompleted-subTitle',
    );
    this.moduleCompletedModuleNameLbl = this.webBasedTrainingFrame.getByTestId(
      'Training-ModuleCompleted-nameTitle',
    );
    this.moduleCompletedAnswerRateLbl = this.webBasedTrainingFrame.getByTestId(
      'Training-ModuleCompleted-correctAnswerRate',
    );
    this.moduleCompletedGoNextModuleBtn =
      this.webBasedTrainingFrame.getByTestId(
        'Training-ModuleCompleted-takeOtherButton',
      );
    this.moduleCompletedViewResultBtn = this.webBasedTrainingFrame.getByTestId(
      'Training-ModuleCompleted-viewResultButton',
    );
    this.trainingCompletedTitleTxt = this.webBasedTrainingFrame.getByTestId(
      'Training-Completed-title',
    );
    this.trainingCompletedSubTitleTxt = this.webBasedTrainingFrame.getByTestId(
      'Training-Completed-subTitle',
    );
    this.trainingCompletedTrainingNameLbl =
      this.webBasedTrainingFrame.getByTestId('Training-Completed-trainingName');
    this.trainingCompletedYourResultsTitleTxt =
      this.webBasedTrainingFrame.getByText(getGameCompletedYourResultTitle());
    this.trainingCompletedModuleNameLbls =
      this.webBasedTrainingFrame.getByTestId(
        'Training-Completed-learningModuleName',
      );
    this.trainingCompletedModuleAnswerRateLbls =
      this.webBasedTrainingFrame.getByTestId(
        'Training-Completed-correctAnswerRate',
      );
    this.trainingCompletedTotalAnswerRateLbl =
      this.webBasedTrainingFrame.getByTestId('CircularProgress-content');
    this.trainingCompletedClosePageBtn = this.webBasedTrainingFrame.getByTestId(
      'Training-Completed-dashboardButton',
    );
  }

  // ========================= ACTIONS ========================

  async clickOnContinueToNextModuleButton() {
    await this.moduleCompletedGoNextModuleBtn.click();
    const nextTrainingModuleKey = getTheNextModuleKey();
    cacheAccessedLearningModuleKey(nextTrainingModuleKey);
  }

  async clickOnCloseThisPageButton() {
    await this.trainingCompletedClosePageBtn.click();
  }

  async clickOnViewLearningResultButton() {
    await this.moduleCompletedViewResultBtn.click();
  }

  // ========================= VERIFY: MODULE COMPLETED ========================

  async verifyTheModuleCompletedTitleShouldBeDisplayed(language?: string) {
    await expect(this.moduleCompletedTitleTxt).toHaveText(
      getGameCompletedTitle(language),
    );
  }

  async verifyTheModuleCompletedSubTitleShouldBeDisplayed(language?: string) {
    await expect(this.moduleCompletedSubTitleTxt).toHaveText(
      getGameCompletedSubTitle(language),
    );
    const token = getAccessedTokenFromCache();
    const moduleKey = getAccessedLearningModuleKeyFromCache();
    await expect(this.moduleCompletedModuleNameLbl).toHaveText(
      getLearningModuleNameByToken(token, moduleKey, language),
    );
  }

  async verifyTheModuleCompletedCorrectAnswerRateShouldBeCorrect() {
    const token = getAccessedTokenFromCache();
    const moduleKey = getAccessedLearningModuleKeyFromCache();
    const learningAnswerRate = getLearningModuleAnswerRateText(
      token,
      moduleKey,
      false,
    );
    await expect(this.moduleCompletedAnswerRateLbl).toHaveText(
      learningAnswerRate,
    );
  }

  async verifyTheContinueNextModuleShouldBeDisplayed(language?: string) {
    await expect(this.moduleCompletedGoNextModuleBtn).toHaveText(
      getGameCompletedContinueToNextModule(language),
    );
  }

  async verifyTheViewLearningResultButtonShouldBeDisplayed(language?: string) {
    await expect(this.moduleCompletedViewResultBtn).toHaveText(
      getGameCompletedViewTrainingResult(language),
    );
  }

  // ========================= VERIFY: TRAINING COMPLETED ========================
  async verifyTheTrainingCompletedTitleShouldBeDisplayed(language?: string) {
    await expect(this.trainingCompletedTitleTxt).toHaveText(
      getGameCompletedTitle(language),
    );
  }

  async verifyTheTrainingCompletedSubTitleShouldBeDisplayed(language?: string) {
    await expect(this.trainingCompletedSubTitleTxt).toHaveText(
      getGameCompletedEntireTrainingCompleted(language),
    );
    const token = getAccessedTokenFromCache();
    const moduleKey = getAccessedLearningModuleKeyFromCache();
    await expect(this.trainingCompletedTrainingNameLbl).toHaveText(
      getTheTrainingSeriesNameByToken(token, language),
    );
  }

  async verifyTheTrainingCompletedCorrectAnswerRatesShouldBeCorrect() {
    const token = getAccessedTokenFromCache();
    const moduleKeys = getLearningModuleKeysByToken(token);
    for (const [index, moduleKey] of moduleKeys.entries()) {
      const moduleAnswerRate = getLearningModuleAnswerRateText(
        token,
        moduleKey,
        true,
      );
      await expect(
        this.trainingCompletedModuleAnswerRateLbls.nth(index),
      ).toHaveText(moduleAnswerRate);
    }
  }

  async verifyTheTrainingCompletedLearningModuleNamesShouldBeCorrect(
    language?: string,
  ) {
    const token = getAccessedTokenFromCache();
    const moduleKeys = getLearningModuleKeysByToken(token);
    for (const [index, moduleKey] of moduleKeys.entries()) {
      const moduleName = getLearningModuleNameByToken(
        token,
        moduleKey,
        language,
      );
      await expect(this.trainingCompletedModuleNameLbls.nth(index)).toHaveText(
        moduleName,
      );
    }
  }

  async verifyTheTotalTrainingTokenRateShouldBeCorrect() {
    const token = getAccessedTokenFromCache();
    const trainingRate = getTotalTrainingTokenRate(token);
    await expect(this.trainingCompletedTotalAnswerRateLbl).toHaveText(
      trainingRate,
    );
  }

  async verifyTheCloseThisPageButtonShouldBeCorrect(language?: string) {
    await expect(this.trainingCompletedClosePageBtn).toHaveText(
      getGameCompletedCloseThisPage(language),
    );
  }

  async verifyTheYourResultsTitleShouldBeDisplayed(language?: string) {
    await expect(this.trainingCompletedYourResultsTitleTxt).toHaveText(
      getGameCompletedYourResultTitle(language),
    );
  }
}
