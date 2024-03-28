import { expect, Locator, Page } from '@playwright/test';
import { FacilityInfoKey } from '../../../../../enums';
import {
  getTeamManagementMemberTitle,
  getTeamManagementTabTitlesYourColleagues,
} from '../../../../../locales/dashboard/get-content';
import { UserTableComponent } from '../../../../../shared-components/dashboard/account/team-management/user-table.component';
import {
  countPlayersOfAdminEmailBelongingToTheOwnerAccount,
  doesAdminAccountHasSubMembers,
  getAllAdminEmailAddressBelongToTheOwnerEmail,
  getAllAdminEmailAdressThatHasSubMembersBelongingToTheOwnerEmail,
  getAllInvitePendingUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers,
  getAllNotStartedUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers,
  getAllUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers,
  getMarketNameByUserEmailAddress,
  getPlayersOfAdminEmailBelongingToTheOwnerAccount,
  getUserPermissions,
  getUserTeamName,
} from '../../../../../tests/data';
import {
  getFactoryNameByUserEmailAddress,
  getFactoryTeamSizeByUserEmailAddress,
} from '../../../../../tests/data/factories/factory.data';
import {
  calculateNumberOfCompletedModulesForUserByEmail,
  calculateTrainingStatusOfUserByEmail,
  getCache,
  setCache,
} from '../../../../../utils';
import { DashboardBasePage } from '../../../dashboard-base.page';

export class TeamManagementPage extends DashboardBasePage {
  private readonly facilityInfoTitleTxt: Locator;
  private readonly inviteColleaguesBtn: Locator;
  private readonly marketValueTxt: Locator;
  private readonly teamMembersTxt: Locator;
  private readonly editTeamSizeIcon: Locator;
  private readonly downloadTrainingReportBtn: Locator;
  private readonly yourColleaguesTab: Locator;
  private readonly yourColleaguesTableNameTxt: Locator;

  private userTableCpt: UserTableComponent;

  constructor(public readonly page: Page) {
    super(page);
    this.facilityInfoTitleTxt = this.page.getByTestId(
      'TeamInformation-nameLabel',
    );
    this.inviteColleaguesBtn = this.page.getByTestId(
      'TrainingUserManagement-inviteMemberButton',
    );
    this.marketValueTxt = this.page.getByTestId(
      'TeamInformation-marketNameLabel',
    );
    this.teamMembersTxt = this.page.getByTestId(
      'TeamInformation-employeeNumberValueLabel',
    );
    this.editTeamSizeIcon = this.page.getByTestId(
      'TeamInformation-editEmployeeNumberIcon',
    );
    this.downloadTrainingReportBtn = this.page.getByTestId(
      'downloadReportButton',
    );
    this.yourColleaguesTab = this.page.getByRole('button', {
      name: getTeamManagementTabTitlesYourColleagues(),
    });
    this.yourColleaguesTableNameTxt =
      this.page.getByTestId('TabLayout-tabTitle');

    this.userTableCpt = new UserTableComponent(page);
  }

  // ========================= ACTION ========================
  async clickOnEditTeamSizeIcon() {
    await this.editTeamSizeIcon.click();
  }

  async clickOnYourColleaguesTab() {
    await this.yourColleaguesTab.click();
  }

  async clickOnInviteColleaguesButton() {
    await this.inviteColleaguesBtn.click();
  }

  async clickOnInviteColleaguesButtonOfYourColleaguesTab() {
    await this.clickOnYourColleaguesTab();
    await this.clickOnInviteColleaguesButton();
  }

  async storeNumberOfEmployeesValue() {
    const teamSize: string = await this.teamMembersTxt.innerText();
    setCache<string>(FacilityInfoKey.NUMBER_OF_EMPLOYEES, teamSize);
  }

  async clickOnDownloadTrainingReportButton() {
    await this.downloadTrainingReportBtn.click();
  }

  async clickOnPlusIconOfTheAdminAccount(adminAccount: string) {
    await this.userTableCpt.clickOnPlusIconOfTheUser(adminAccount);
  }

  async clickOnMinusIconOfTheAdminAccount(adminAccount: string) {
    await this.userTableCpt.clickOnMinusIconOfTheUser(adminAccount);
  }

  // ========================= VERIFY ========================
  async verifyTheTeamInfoShouldBeMatchedCreatedDataByUserEmail(
    emailAddress: string,
  ) {
    const factoryName: string = getFactoryNameByUserEmailAddress(emailAddress);
    const market: string = getMarketNameByUserEmailAddress(emailAddress);
    const teamMembers: string =
      getFactoryTeamSizeByUserEmailAddress(emailAddress);
    await expect(this.facilityInfoTitleTxt).toHaveText(factoryName);
    await expect(this.marketValueTxt).toHaveText(market);
    await expect(this.teamMembersTxt).toHaveText(teamMembers);
  }

  async verifyTheNumberOfEmployeesValueShouldNotBeChanged() {
    const teamSize: string = getCache(FacilityInfoKey.NUMBER_OF_EMPLOYEES);
    await expect(this.teamMembersTxt).toHaveText(teamSize);
  }

  async verifyTheNumberOfEmployeesValueShouldBeUpdatedCorrectly() {
    const edittedTeamSize: string = getCache(
      FacilityInfoKey.SELECT_NUMBER_OF_EMPLOYEES,
    );
    await expect(this.teamMembersTxt).toHaveText(edittedTeamSize);
  }

  async verifyTheYourColleaguesTableNameShouldBeDisplayed() {
    const expectedText = getTeamManagementMemberTitle();
    await expect(
      this.yourColleaguesTableNameTxt,
      `Verify the Your Colleagues table name should have text '${expectedText}'`,
    ).toHaveText(expectedText);
  }

  async verifyTheInviteColleaguesButtonShouldBeDisplayed() {
    await expect(
      this.inviteColleaguesBtn,
      'Verify the Invite Colleagues button should be visible',
    ).toBeVisible();
  }

  private async verifyTheColleaguesColumnShouldBeShowTheEmailOfTheUser(
    user: string,
  ) {
    const actualColleagues = await this.userTableCpt.getUserColleagues(user);
    expect(
      actualColleagues,
      `Verify the ${user} should be displayed in Colleagues Collumn`,
    ).toEqual(user);
  }

  private async verifyTheStatusColumnShouldShowTheTrainingStatusOfTheUser(
    user: string,
  ) {
    const actualStatus = await this.userTableCpt.getUserStatus(user);
    const expectedStatus = calculateTrainingStatusOfUserByEmail(user);
    expect(
      actualStatus,
      `Verify the ${user}'s status should be equal to ${expectedStatus}'`,
    ).toEqual(expectedStatus);
  }

  private async verifyTheCompletedModulesColumnShouldShowTheCompletedTrainingModuleOfTheUser(
    user: string,
  ) {
    const actualCompletedModules =
      await this.userTableCpt.getUserCompletedModule(user);
    const expectedCompletedModules =
      calculateNumberOfCompletedModulesForUserByEmail(user).toString();
    expect(
      actualCompletedModules,
      `Verify the ${user}'s completed module should be equal to ${expectedCompletedModules}`,
    ).toEqual(expectedCompletedModules);
  }

  private async verifyThePermissionsColumnShouldShowTheRightsOfTheUser(
    user: string,
  ) {
    const actualPermissions = await this.userTableCpt.getUserPermissions(user);
    const expectedPermissions = getUserPermissions(user);
    expect(
      actualPermissions,
      `Verify the ${user}'s permissions should be equal to ${expectedPermissions}`,
    ).toEqual(expectedPermissions);
  }

  async verifyTheColleaguesColumnShouldShowMembersEmailsOfTheOwner(
    ownerEmail: string,
  ) {
    const emailAddressLst =
      getAllUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
        ownerEmail,
      );
    const actualColleagues = await this.userTableCpt.getAllColleagues();
    expect(
      actualColleagues.sort(),
      `Verify the ${ownerEmail}'s colleagues should be displayed correctly'`,
    ).toEqual(emailAddressLst.sort());
  }

  async verifyTheStatusColumnShouldShowTheTrainingStatusOfTheMembersBelongingToTheOwner(
    ownerEmail: string,
  ) {
    const emailAddressLst =
      getAllUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
        ownerEmail,
      );
    for (const email of emailAddressLst) {
      await this.verifyTheStatusColumnShouldShowTheTrainingStatusOfTheUser(
        email,
      );
    }
  }

  async verifyTheCompletedModulesColumnShouldShowTheCompletedTrainingModuleOfTheMembersBelongingToTheOwner(
    ownerEmail: string,
  ) {
    const emailAddressLst =
      getAllUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
        ownerEmail,
      );
    for (const email of emailAddressLst) {
      await this.verifyTheCompletedModulesColumnShouldShowTheCompletedTrainingModuleOfTheUser(
        email,
      );
    }
  }

  async verifyThePermissionsColumnShouldShowTheRightsOfMembersBelongingToTheOwner(
    ownerEmail: string,
  ) {
    const emailAddressLst =
      getAllUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
        ownerEmail,
      );
    for (const email of emailAddressLst) {
      await this.verifyThePermissionsColumnShouldShowTheRightsOfTheUser(email);
    }
  }

  async verifyTheSubTeamColumnShouldShowTheTeamNameOfMembersBelongingToTheOwner(
    ownerEmail: string,
  ) {
    const adminLst = getAllAdminEmailAddressBelongToTheOwnerEmail(ownerEmail);
    for (const email of adminLst) {
      const actualTeamName = await this.userTableCpt.getUserSubTeamName(email);
      const expectedTeamName = getUserTeamName(email);
      expect(
        actualTeamName,
        `Verify the ${email}'s sub team should be displayed correctly`,
      ).toEqual(expectedTeamName);
    }
  }

  async verifyTheHashColumnShouldShowTheAdminTeamMembersBelongingToTheOwner(
    ownerEmail: string,
  ) {
    const adminLst =
      getAllAdminEmailAdressThatHasSubMembersBelongingToTheOwnerEmail(
        ownerEmail,
      );
    for (const email of adminLst) {
      const actualTeamName = await this.userTableCpt.getUserAdminTeamMember(
        email,
      );
      const expectedTeamName =
        countPlayersOfAdminEmailBelongingToTheOwnerAccount(ownerEmail, email);
      expect(
        actualTeamName,
        `Verify the number of members of ${email} should be displayed correctly`,
      ).toEqual(expectedTeamName.toString());
    }
  }

  async verifyTheEnvelopeAndTimesCircleIconsShouldDisplayWithInvitePendingUserBelongingToTheOwner(
    ownerEmail: string,
  ) {
    const emailLst =
      getAllInvitePendingUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
        ownerEmail,
      );
    for (const email of emailLst) {
      await this.userTableCpt.verifyTheEnvelopeIconOfTheUserShouldBeDisplayed(
        email,
      );
      await this.userTableCpt.verifyTheTimesCircleIconOfTheUserShouldBeDisplayed(
        email,
      );
    }
  }

  async verifyTheEnvelopeIconShouldDisplayWithNotStartedUserBelongingToTheOwner(
    ownerEmail: string,
  ) {
    const emailLst =
      getAllNotStartedUsersEmailAddressBelongingToTheOwnerEmailWithoutAdminPlayers(
        ownerEmail,
      );
    for (const email of emailLst) {
      if (
        !doesAdminAccountHasSubMembers(ownerEmail, email) &&
        email != ownerEmail
      ) {
        await this.userTableCpt.verifyTheEnvelopeIconOfTheUserShouldBeDisplayed(
          email,
        );
      }
    }
  }

  async verifyThePlusIconShouldDisplayWithTheAdminAccountThatHasSubMembersBelongingToTheOwner(
    ownerEmail: string,
  ) {
    const adminLst =
      getAllAdminEmailAdressThatHasSubMembersBelongingToTheOwnerEmail(
        ownerEmail,
      );
    for (const email of adminLst) {
      await this.userTableCpt.verifyThePlusIconOfTheUserShouldBeDisplayed(
        email,
      );
    }
  }

  async verifyTheMinusIconShouldDisplayWithTheAdminAccount(adminEmail: string) {
    await this.userTableCpt.verifyTheMinusIconOfTheUserShouldBeDisplayed(
      adminEmail,
    );
  }

  async verifyThePlusIconShouldDisplayWithTheAdminAccount(adminEmail: string) {
    await this.userTableCpt.verifyThePlusIconOfTheUserShouldBeDisplayed(
      adminEmail,
    );
  }

  private async verifyTheListMembersDataOfTheAdminAccountBelongingToTheOwner(
    ownerEmail: string,
    adminEmail: string,
    isDisplayed: boolean,
  ) {
    const playersLst = getPlayersOfAdminEmailBelongingToTheOwnerAccount(
      ownerEmail,
      adminEmail,
    );
    for (const player of playersLst) {
      const email: string = player.email;
      if (isDisplayed) {
        await this.verifyTheColleaguesColumnShouldBeShowTheEmailOfTheUser(
          email,
        );
        await this.verifyTheStatusColumnShouldShowTheTrainingStatusOfTheUser(
          email,
        );
        await this.verifyTheCompletedModulesColumnShouldShowTheCompletedTrainingModuleOfTheUser(
          email,
        );
        await this.verifyThePermissionsColumnShouldShowTheRightsOfTheUser(
          email,
        );
      } else {
        await this.userTableCpt.verifyTheUserIsHidden(email);
      }
    }
  }

  async verifyTheListMembersDataOfTheAdminAccountBelongingToTheOwnerShouldDisplayCorrectly(
    ownerEmail: string,
    adminEmail: string,
  ) {
    await this.verifyTheListMembersDataOfTheAdminAccountBelongingToTheOwner(
      ownerEmail,
      adminEmail,
      true,
    );
  }

  async verifyTheMemberListOfTheAdminAccountBelongingToTheOwnerShouldBeHidden(
    ownerEmail: string,
    adminEmail: string,
  ) {
    await this.verifyTheListMembersDataOfTheAdminAccountBelongingToTheOwner(
      ownerEmail,
      adminEmail,
      false,
    );
  }
}
