import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';
import {
  getBaselineIntro,
  getBaselineLetGo,
} from '../../../locales/app-content/get-app-content.locale';
import {
  REGEX_BACKWARD_SLASH,
  WAIT_IN_10_SECOND,
  WAIT_IN_20_SECOND,
} from '../../../constants';
import {
  getAccessedLearningModuleKeyFromCache,
  getAccessedTokenFromCache,
} from '../../../utils';
import {
  getLearningModuleKeyByTokenAndModuleOrder,
  getLearningModuleNameByToken,
} from '../../../tests/data/training-content/training-content.data';

export class WebBasedAlmostTherePage extends WebBasedTrainingBasePage {
  private readonly descriptionTxt: Locator;
  private readonly okLetGoBtn: Locator;
  private readonly moduleNameLbl: Locator;
  private readonly baselineIntroTxt: string;
  private readonly baselineLetGoBtnTxt: string;

  constructor(public readonly page: Page) {
    super(page);
    this.descriptionTxt = this.webBasedTrainingFrame.getByTestId(
      'Baseline-Intro-description',
    );
    this.okLetGoBtn = this.webBasedTrainingFrame.getByTestId(
      'Baseline-Intro-submitButton',
    );
    this.moduleNameLbl = this.webBasedTrainingFrame.getByTestId('-nameTitle');
    this.baselineIntroTxt = getBaselineIntro().replace(
      REGEX_BACKWARD_SLASH,
      '',
    );
    this.baselineLetGoBtnTxt = getBaselineLetGo();
  }

  // ========================= ACTIONS ========================

  async clickOnOkLetGoButton() {
    await expect(this.okLetGoBtn).toBeEnabled({ timeout: WAIT_IN_10_SECOND });
    await this.okLetGoBtn.click();
  }

  // ========================= VERIFY ========================

  async verifyTheDescriptionTextShouldBeCorrect() {
    await expect(this.descriptionTxt).toHaveText(this.baselineIntroTxt);
  }

  async verifyTheOkLetGoButtonShouldBeCorrect() {
    await expect(this.okLetGoBtn).toHaveText(this.baselineLetGoBtnTxt);
  }

  async verifyTheModuleNameShouldBeDisplayedCorrectly(
    token: string,
    moduleKey: string,
    language?: string,
  ) {
    const trainingModuleName = getLearningModuleNameByToken(
      token,
      moduleKey,
      language,
    );
    await expect(this.moduleNameLbl).toHaveText(trainingModuleName, {
      timeout: WAIT_IN_20_SECOND,
    });
  }

  async verifyTheModuleNameShouldBeCorrect(language?: string) {
    const token = getAccessedTokenFromCache();
    const moduleKey = getAccessedLearningModuleKeyFromCache();
    await this.verifyTheModuleNameShouldBeDisplayedCorrectly(
      token,
      moduleKey,
      language,
    );
  }

  async verifyTheModuleNameShouldBeDisplayedWithModuleOrder(
    moduleOrder: number,
    language?: string,
  ) {
    const token = getAccessedTokenFromCache();
    const moduleKey = getLearningModuleKeyByTokenAndModuleOrder(
      token,
      moduleOrder,
    );
    await this.verifyTheModuleNameShouldBeDisplayedCorrectly(
      token,
      moduleKey,
      language,
    );
  }
}
