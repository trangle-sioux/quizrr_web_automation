import { expect, Locator, Page } from '@playwright/test';
import { EXCLAMATION_SYMBOL } from '../../../constants/symbols.constant';
import { getFinishTitle } from '../../../locales/dashboard/get-content/sign-up.locale';
import { BasePage } from '../../base.page';

export class SignUpCreateFacilityTeamPage extends BasePage {
  private readonly titleTxt: Locator;
  private readonly yourTeamNameInputField: Locator;
  private readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.titleTxt = this.page.getByTestId('FacilityTeamName-title');
    this.yourTeamNameInputField = this.page.getByTestId('facilityTeamName');
    this.continueBtn = this.page.getByTestId('FacilityTeamName-continueButton');
  }

  // ========================= ACTION ========================
  async enterYourTeamName(teamName: string) {
    await this.yourTeamNameInputField.fill(teamName);
  }

  async clickOnTheContinueButton() {
    await this.continueBtn.click();
  }

  // ========================= VERIFY ========================

  async verifyTheFacilityTeamNameShouldBeDisplayed() {
    let title: string = getFinishTitle();
    title = title.replace(EXCLAMATION_SYMBOL, '');
    await expect(this.titleTxt).toHaveText(title);
  }
}
