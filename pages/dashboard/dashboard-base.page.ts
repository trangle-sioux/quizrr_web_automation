import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../../shared-components/dashboard';
import { BasePage } from '../base.page';
import { GuidelineTourComponent } from '../../shared-components/dashboard/guideline-popup.component';

export class DashboardBasePage extends BasePage {
  private readonly declineCookiesBtn: Locator;
  private readonly headerCpt: HeaderComponent;
  private readonly guidelinePopupCpt: GuidelineTourComponent;
  private readonly acceptCookiesBtn: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.headerCpt = new HeaderComponent(page);
    this.guidelinePopupCpt = new GuidelineTourComponent(page);
    this.declineCookiesBtn = this.page.getByTestId('rcc-decline-button');
    this.acceptCookiesBtn = this.page.getByTestId('rcc-confirm-button');
  }

  // ========================= ACTION ========================

  async gotoTeamManagementPage() {
    await this.headerCpt.clickOnUserprofileIcon();
    await this.headerCpt.clickOnTeaManagementLink();
  }

  async logout() {
    await this.headerCpt.clickOnUserprofileIcon();
    await this.headerCpt.clickOnLogoutButton();
  }

  async clickShowMeAround() {
    await this.guidelinePopupCpt.clickShowMeAround();
  }

  async closeGuidelinePopup() {
    await this.guidelinePopupCpt.closeGuidelinePopup();
  }

  async declineCookies() {
    if (await this.declineCookiesBtn.isVisible()) {
      await this.declineCookiesBtn.click();
    }
  }

  async clickOnStartTrainingButton() {
    await this.headerCpt.clickOnStartTrainingButton();
  }

  async acceptCookies() {
    await this.acceptCookiesBtn.click();
  }

  // ========================= VERIFY ========================
  async verifyTheGuidelinePopupShouldBeDisplayed() {
    await this.guidelinePopupCpt.verifyGuidelinePopupShouldBeDisplayed();
  }
}
