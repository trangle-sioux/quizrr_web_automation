import { expect, Locator, Page } from '@playwright/test';
import { DashboardBasePage } from '../dashboard-base.page';
import {
  getFinishStartTraining,
  getFinishTitle,
} from '../../../locales/dashboard/get-content';

export class CongratulationPage extends DashboardBasePage {
  private readonly congratulationsLbl: Locator;
  private readonly startTrainingBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.congratulationsLbl = this.page.getByText(getFinishTitle());
    this.startTrainingBtn = this.page.getByText(getFinishStartTraining());
  }

  // ========================= ACTION ========================

  async clickOnTheStartTrainingButton() {
    await this.startTrainingBtn.click();
  }

  // ========================= VERIFY ========================

  async verifyTheCongratulationsPageShouldBeDisplayed() {
    await expect(this.congratulationsLbl).toBeVisible();
    await expect(this.startTrainingBtn).toBeVisible();
  }
}
