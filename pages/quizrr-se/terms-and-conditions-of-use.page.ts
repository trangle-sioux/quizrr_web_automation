import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class TermsAndConditionsOfUsePage extends BasePage {
  TERMS_AND_CONDITIONS_TITLE =
    'Quizrr – Worker-Centric Digital Training - Terms and Conditions of Use';

  constructor(public readonly page: Page) {
    super(page);
  }
  // ==================== VERIFY ===========================

  async verifyTheTermsAndConditionsOfUsePageIsDisplayed() {
    const actualTitle: string = await this.page.title();
    expect(actualTitle).toEqual(this.TERMS_AND_CONDITIONS_TITLE);
    await expect(this.page).toHaveURL(/.*terms-and-conditions-of-use/);
  }
}
