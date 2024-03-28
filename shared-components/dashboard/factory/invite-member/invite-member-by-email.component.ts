import { expect, Locator, Page } from '@playwright/test';
import { COMMA_SYMBOL } from '../../../../constants';
import { DateTimeKey } from '../../../../enums';
import {
  getInviteMembersInviteByEmail,
  getInviteMembersRolesPlayer,
} from '../../../../locales/dashboard/get-content';
import { setCache } from '../../../../utils';

export class InviteMemberByEmailComponent {
  private readonly inviteMemberByEmailLbl: Locator;
  private readonly inviteByEmailInputField: Locator;
  private readonly inviteByEmailSelection: Locator;
  private readonly inviteByEmailSelectOpts: Locator;
  private readonly inviteByEmailSendInviteBtn: Locator;
  private readonly selectedRolePlayerLbl: Locator;

  constructor(public readonly page: Page) {
    this.inviteMemberByEmailLbl = this.page.getByTestId(
      'InviteMemberByEmail-label',
    );
    this.inviteByEmailInputField = this.page.getByTestId(
      'InviteMembersByEmail-emailInput',
    );
    this.inviteByEmailSelection = this.page.getByTestId(
      'InviteMemberByEmail-roleSelection',
    );
    this.inviteByEmailSelectOpts = this.page.locator(
      'div#InviteMemberByEmail-roleSelection div[class*="option"]',
    );
    this.inviteByEmailSendInviteBtn = this.page.getByTestId(
      'InviteMemberByEmail-button',
    );
    this.selectedRolePlayerLbl = this.page.locator(
      'div#InviteMemberByEmail-roleSelection div[class*="singleValue"]',
    );
  }

  // ========================= ACTION ========================

  async enterEmail(email: string) {
    await this.inviteByEmailInputField.click();
    await this.inviteByEmailInputField.pressSequentially(email, { delay: 100 });
    // Click another the place after finishing enter email.
    await this.inviteMemberByEmailLbl.click();
  }

  async selectAccountRole(option: string) {
    await this.inviteByEmailSelection.click();
    await this.inviteByEmailSelectOpts.filter({ hasText: option }).click();
  }

  async selectCanAdminOption() {
    await this.selectAccountRole('can admin');
  }

  async clickOnSendInvitesButton() {
    await this.inviteByEmailSendInviteBtn.click();
    setCache(DateTimeKey.SEND_INVITE_EMAIL, new Date());
  }

  // ========================= VERIFy ========================
  private async verifyTheTitleShouldBeDisplayed() {
    const titleTxt = getInviteMembersInviteByEmail().split(COMMA_SYMBOL)[0];
    await expect(
      this.inviteMemberByEmailLbl,
      'Verify Invite colleagues by email title',
    ).toHaveText(titleTxt);
  }

  private async verifyTheEmailInputFieldShouldBeDisplayed() {
    await expect(
      this.inviteByEmailInputField,
      'Verify Email Input field',
    ).toBeVisible();
  }

  private async verifyTheCanTrainValueShouldBeDisplayed() {
    const text = getInviteMembersRolesPlayer();
    await expect(
      this.selectedRolePlayerLbl,
      'Verify the selected Role Player value',
    ).toHaveText(text);
  }

  private async verifyTheSendInvitesButtonShouldBeDisplayed() {
    await expect(
      this.inviteByEmailSendInviteBtn,
      'Verify Send Invites button',
    ).toBeVisible();
  }

  async verifyInviteMemberByEmailShouldBeDisplayedCorrectly() {
    await this.verifyTheTitleShouldBeDisplayed();
    await this.verifyTheEmailInputFieldShouldBeDisplayed();
    await this.verifyTheCanTrainValueShouldBeDisplayed();
    await this.verifyTheSendInvitesButtonShouldBeDisplayed();
  }
}
