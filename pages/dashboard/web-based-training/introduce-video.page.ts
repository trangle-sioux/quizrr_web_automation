import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';

export class WebBasedIntroduceVideoPage extends WebBasedTrainingBasePage {
  private readonly nextBtn: Locator;
  private readonly introduceVideo: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.nextBtn = this.webBasedTrainingFrame.getByTestId(
      'IntroVideo-nextButton',
    );
    this.introduceVideo = this.webBasedTrainingFrame.getByTestId(
      'IntroVideo-videoPlayer',
    );
  }

  // ========================= ACTIONS ========================

  async clickOnNextButton() {
    await this.nextBtn.click();
  }

  // ========================= VERIFY ========================

  async verifyTheNextButtonShouldBeDisplayed() {
    await expect(this.nextBtn).toBeVisible();
  }

  async verifyTheIntroduceVideoShouldBeDisplayed() {
    await expect(this.introduceVideo).toBeVisible();
  }
}
