import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../base.page';
import { getGoToTrainingButtonText } from '../../../locales/dashboard/get-content';

export class GoToTrainingPage extends BasePage {
  private readonly goToTrainingBtn: Locator;
  constructor(public readonly page: Page) {
    super(page);
    this.goToTrainingBtn = this.page.getByText(getGoToTrainingButtonText());
  }

  // ========================= ACTIONS ========================

  async clickOnTheGoToTrainingButton() {
    await this.goToTrainingBtn.click();
  }
  // ========================= VERIFY ========================
  async verifyTheGoToTrainingPageShouldBeDisplayed() {
    await expect(this.goToTrainingBtn).toBeVisible();
  }
}
