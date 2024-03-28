import { FrameLocator, Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../base.page';
import { WebBasedGuidelineTourComponent } from '../../../shared-components/dashboard';

export class WebBasedTrainingBasePage extends BasePage {
  private readonly webBasedTrainingCloseBtn: Locator;
  readonly webBasedTrainingFrame: FrameLocator;
  private readonly guidelinePopupCpt: WebBasedGuidelineTourComponent;

  constructor(public readonly page: Page) {
    super(page);
    this.webBasedTrainingFrame = this.page.frameLocator(
      '#SideBar-WebBase-iframe',
    );
    this.webBasedTrainingCloseBtn = this.page.getByTestId(
      'WebBasedTrainingPopup-times-button',
    );
    this.guidelinePopupCpt = new WebBasedGuidelineTourComponent(page);
  }

  // ========================= ACTION ========================

  async closeTheWebBasedTrainingPopup() {
    await this.webBasedTrainingCloseBtn.click();
  }

  async closeGuidelinePopup() {
    await this.guidelinePopupCpt.closeGuidelinePopup();
  }

  // ========================= VERIFY ========================

  async verifyTheWebasedTrainingShouldBeHidden() {
    await expect(this.webBasedTrainingCloseBtn).toBeHidden();
  }
}
