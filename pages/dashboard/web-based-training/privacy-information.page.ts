import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';
import { getPrivacyTitle } from '../../../locales/app-content/get-app-content.locale';

export class WebBasedPrivacyInformationPage extends WebBasedTrainingBasePage {
  private readonly privacyTitleTxt: Locator;
  private readonly voiceOverBtn: Locator;
  private readonly agreeBtn: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.privacyTitleTxt = this.webBasedTrainingFrame.getByTestId(
      'OnboardingPrivacyPolicy-title',
    );
    this.voiceOverBtn = this.webBasedTrainingFrame.getByTestId(
      'OnboardingPrivacyPolicy-voButton',
    );
    this.agreeBtn = this.webBasedTrainingFrame.getByTestId(
      'OnboardingPrivacyPolicy-nextButton',
    );
  }

  // ========================= ACTIONS ========================

  async clickOnPrivacyAgreeButton() {
    await this.agreeBtn.click();
  }

  // ========================= VERIFY ========================

  async verifyTheTitleShouldBeDisplayed() {
    await expect(this.privacyTitleTxt).toHaveText(getPrivacyTitle());
  }

  async verifyTheTitleShouldBeHidden() {
    await expect(this.privacyTitleTxt).toBeHidden();
  }

  async verifyTheVoiceOverButtonShouldBeDisplayed() {
    await expect(this.voiceOverBtn).toBeVisible();
  }

  async verifyTheAgreeButtonShouldBeDisplayed() {
    await expect(this.agreeBtn).toBeVisible();
  }
}
