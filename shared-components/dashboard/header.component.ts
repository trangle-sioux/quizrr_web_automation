import { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  private readonly userProfileIcon: Locator;
  private readonly teamManagementOpt: Locator;
  private readonly logoutBtn: Locator;
  private readonly startTrainingBtn: Locator;

  constructor(public readonly page: Page) {
    this.userProfileIcon = this.page.getByTestId('Dashboard-userProfileButton');
    this.teamManagementOpt = this.page.getByTestId(
      'AccountMenu-teamManagementTabLink',
    );
    this.logoutBtn = this.page.getByTestId('UserMenu-logoutButton');
    this.startTrainingBtn = this.page.getByTestId(
      'Dashboard-startTrainingButton',
    );
  }

  // ========================= ACTION ========================
  async clickOnUserprofileIcon() {
    await this.userProfileIcon.click();
  }

  async clickOnStartTrainingButton() {
    await this.startTrainingBtn.click();
  }

  async clickOnTeaManagementLink() {
    await this.teamManagementOpt.click();
  }

  async clickOnLogoutButton() {
    await this.logoutBtn.click();
  }
}
