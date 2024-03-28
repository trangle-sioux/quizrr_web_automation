import { expect, Locator, type Page } from '@playwright/test';
import { FacilityInfoKey } from '../../../../../enums';
import { getTeamManagementInformationEditOrganization } from '../../../../../locales/dashboard/get-content';
import { TeamSizeSelectionComponent } from '../../../../../shared-components/dashboard';
import { getCache, setCache } from '../../../../../utils';
import { DashboardBasePage } from '../../../dashboard-base.page';

export class EditOrganizationInfoPopupPage extends DashboardBasePage {
  private readonly titleTxt: Locator;
  private readonly closeBtn: Locator;
  private readonly saveBtn: Locator;

  private readonly teamSizeSelectionCpt: TeamSizeSelectionComponent;

  constructor(public readonly page: Page) {
    super(page);
    this.teamSizeSelectionCpt = new TeamSizeSelectionComponent(page);
    this.titleTxt = this.page.getByTestId('EditFacilityInfoPopup-label');
    this.closeBtn = this.page.getByTestId('EditFacilityInfoPopup-closeButton');
    this.saveBtn = this.page.getByTestId('EditFacilityInfoPopup-saveButton');
  }

  // ========================= ACTION ========================
  async clickOnClosePopUpButton() {
    await this.closeBtn.click();
  }

  async clickOnNumberOfEmployeesField() {
    await this.teamSizeSelectionCpt.clickOnTheTeamSizeField();
  }

  async selectAnyNumberOfEmployeesValue() {
    await this.teamSizeSelectionCpt.selectAnyTeamSize();
    await this.storeSelectedNumberOfEmployeesValue();
  }

  async selectNumberOfEmployeesValue(teamSize: string) {
    await this.teamSizeSelectionCpt.selectTeamSize(teamSize);
    await this.storeSelectedNumberOfEmployeesValue();
  }

  async storeSelectedNumberOfEmployeesValue() {
    setCache<string>(
      FacilityInfoKey.SELECT_NUMBER_OF_EMPLOYEES,
      await this.teamSizeSelectionCpt.getTeamSizeValue(),
    );
  }

  async selectNumberOfEmployeesValueDifferentFromTheCurrent() {
    const currentValue: string =
      await this.teamSizeSelectionCpt.getTeamSizeValue();
    await this.teamSizeSelectionCpt.selectAnyTeamSizeDiffrentFromTheCurrent(
      currentValue,
    );
    await this.storeSelectedNumberOfEmployeesValue();
  }

  async clickOnSaveButton() {
    await this.saveBtn.click();
  }

  // ========================= VERIFY ========================
  async verifyTheSaveButtonShouldBeDisabled() {
    await expect(this.saveBtn).toBeDisabled();
  }

  async verifyTheSaveButtonShouldBeEnabled() {
    await expect(this.saveBtn).toBeEnabled();
  }

  async verifyTheTitlePopupShouldBeDisplayedCorrectly() {
    await expect(this.titleTxt).toHaveText(
      getTeamManagementInformationEditOrganization(),
    );
  }

  async verifyTheNumberOfEmployeesShouldBeDisplayedTheCurrentTeamValue() {
    const currentTeamValue: string = getCache(
      FacilityInfoKey.NUMBER_OF_EMPLOYEES,
    );
    await this.teamSizeSelectionCpt.verifyTheTeamSizeValueShouldBeDisplayed(
      currentTeamValue,
    );
  }

  async verifyTheNumberOfEmployeesListShouldBeDisplayedCorrectly() {
    await this.teamSizeSelectionCpt.verifyTheTeamSizeListShouldBeDisplayedCorrectly();
  }

  async verifyTheEditOrganizationInfoPopupShouldBeClosed() {
    await expect(this.titleTxt).not.toBeVisible();
  }
}
