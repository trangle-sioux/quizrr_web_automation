import { Locator, Page, expect } from '@playwright/test';
import { DashboardBasePage } from '../../dashboard-base.page';
import { getFacilityInfoTitle } from '../../../../locales';

export class OverviewPage extends DashboardBasePage {
  private readonly facilityInfoLbl: Locator;
  constructor(page: Page) {
    super(page);
    this.facilityInfoLbl = this.page.getByText(getFacilityInfoTitle());
  }

  // ========================= ACTION ========================

  // ========================= VERIFY ========================
  async verifyTheOverviewPageShouldBeDisplayed() {
    await expect(this.facilityInfoLbl).toBeVisible();
  }
}
