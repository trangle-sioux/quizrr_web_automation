import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class PrivacyPolicyPage extends BasePage {
  PRIVACY_POLICY_TITLE =
    'Quizrr – Worker-Centric Digital Training - Privacy Policy';

  constructor(public readonly page: Page) {
    super(page);
  }

  async verifyThePrivacyPolicyPageIsDisplayed() {
    const actualTitle: string = await this.page.title();
    expect(actualTitle).toEqual(this.PRIVACY_POLICY_TITLE);
    await expect(this.page).toHaveURL(/.*privacy-policy/);
  }
}
