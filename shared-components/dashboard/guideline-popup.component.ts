import { expect, Locator, type Page } from '@playwright/test';
import { WAIT_IN_10_SECOND, WAIT_IN_20_SECOND } from '../../constants';

export class GuidelineTourComponent {
  private readonly showMeAroundBtn: Locator;
  private readonly guidelineTitleTxt: Locator;
  private readonly skipJoyrideBtn: Locator;

  constructor(public readonly page: Page) {
    this.showMeAroundBtn = this.page.getByTestId('JoyrideTooltip-nextButton');
    this.guidelineTitleTxt = this.page.getByTestId('JoyrideTooltip-title');
    this.skipJoyrideBtn = this.page.getByTestId('JoyrideTooltip-skipButton');
  }

  // ========= ACTIONS =========

  async clickShowMeAround() {
    await this.showMeAroundBtn.click();
  }

  async closeGuidelinePopup() {
    await this.skipJoyrideBtn.waitFor({
      state: 'visible',
      timeout: WAIT_IN_20_SECOND,
    });
    // wait until the pop-up is displayed to close, max: 10s
    await this.skipJoyrideBtn.click({ timeout: WAIT_IN_10_SECOND });
    // wait until the pop-up is closed
    await expect(this.skipJoyrideBtn).toBeHidden();
  }

  // ========= VERIFY =========

  async verifyGuidelinePopupShouldBeDisplayed() {
    await expect(this.guidelineTitleTxt).toBeVisible();
  }
}
