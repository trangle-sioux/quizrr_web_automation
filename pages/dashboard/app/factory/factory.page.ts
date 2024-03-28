import { expect, Page } from '@playwright/test';
import { DashboardBasePage } from '../../dashboard-base.page';
import { HeaderComponent } from '../../../../shared-components/dashboard';

export class FactoryPage extends DashboardBasePage {
  constructor(public readonly page: Page) {
    super(page);
  }

  // ========================= ACTION ========================

  // ========================= VERIFY ========================
  async verifyTheFactoryPageShouldBeDisplayed() {
    const actualTitle: string = await this.page.title();
    expect(actualTitle).toEqual('Quizrr Dashboard');
    await expect(this.page).toHaveURL(/.*\/app\/factory.*/);
  }
}
