import { expect, FrameLocator, Locator, type Page } from '@playwright/test';
import { WAIT_IN_20_SECOND } from '../../../constants';

export class WebBasedGuidelineTourComponent {
  private readonly closePopupBtn: Locator;
  readonly webBasedTrainingFrame: FrameLocator;

  constructor(public readonly page: Page) {
    this.webBasedTrainingFrame = this.page.frameLocator(
      '#SideBar-WebBase-iframe',
    );
    this.closePopupBtn = this.webBasedTrainingFrame.getByTestId(
      'JoyrideTooltip-skipButton',
    );
  }

  // ========= ACTIONS =========

  async closeGuidelinePopup() {
    await expect(this.closePopupBtn).toBeEnabled({
      timeout: WAIT_IN_20_SECOND,
    });
    await this.closePopupBtn.click();
    await expect(this.closePopupBtn).toBeHidden();
  }

  // ========= VERIFY =========
}
