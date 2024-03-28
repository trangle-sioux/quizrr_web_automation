import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';

export class WebBasedGameboardPage extends WebBasedTrainingBasePage {
  private readonly gameboardLocationIcon: (index: number) => Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.gameboardLocationIcon = (index: number) =>
      this.webBasedTrainingFrame.getByTestId(
        `Gameboard-LocationIndicator-${index}`,
      );
  }

  // ========================= ACTIONS ========================

  async clickOnQuestionLocationIconIndex(index: number) {
    await expect(this.gameboardLocationIcon(index)).toBeEnabled();
    await this.gameboardLocationIcon(index).click({ force: true });
  }

  async clickOnFirstQuestionLocationIcon() {
    await this.clickOnQuestionLocationIconIndex(0);
  }

  // ========================= VERIFY ========================
}
