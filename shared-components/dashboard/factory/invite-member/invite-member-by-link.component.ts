import { expect, Locator, Page } from '@playwright/test';
import { LinkKey } from '../../../../enums';
import {
  getInviteMembersInviteLink,
  getInviteMembersRolesPlayer,
} from '../../../../locales/dashboard/get-content';
import { setCache } from '../../../../utils';

export class InviteMemberByLinkComponent {
  private readonly inviteByLinkLbl: Locator;
  private readonly inviteByLinkSelection: Locator;
  private readonly inviteByLinkSelectOpts: Locator;
  private readonly inviteByLinkCopyLinkBtn: Locator;
  private readonly inviteByLinkInputField: Locator;
  private readonly selectedRolePlayerLbl: Locator;

  constructor(public readonly page: Page) {
    this.inviteByLinkLbl = this.page.getByTestId('InviteMemberByLink-label');
    this.inviteByLinkSelection = this.page.getByTestId(
      'InviteMemberByLink-roleSelection',
    );
    this.inviteByLinkSelectOpts = this.page.locator(
      'div#InviteMemberByLink-roleSelection div[class*="option"]',
    );
    this.inviteByLinkCopyLinkBtn = this.page.getByTestId(
      'InviteMemberByLink-button',
    );
    this.inviteByLinkInputField = this.page.getByTestId(
      'InviteMemberByLink-inviteLinkInput',
    );

    this.selectedRolePlayerLbl = this.page.locator(
      'div#InviteMemberByLink-roleSelection div[class*="singleValue"]',
    );
  }

  // ========================= ACTION ========================

  async selectAccountRole(option: string) {
    await this.inviteByLinkSelection.click();
    await this.inviteByLinkSelectOpts.filter({ hasText: option }).click();
  }

  async selectCanAdminOption() {
    await this.selectAccountRole('can admin');
  }

  async storeValueOfInviteByLinkInput() {
    const value = await this.inviteByLinkInputField.inputValue();
    setCache(LinkKey.INVITE_BY_LINK, value);
  }

  async getValueOfInviteByLinkInputWithAdminRole() {
    await this.selectCanAdminOption();
    const value = await this.inviteByLinkInputField.inputValue();
    return value;
  }

  async clickOnCopyInviteLinkButton() {
    this.storeValueOfInviteByLinkInput();
    await this.inviteByLinkCopyLinkBtn.click();
  }

  // ========================= VERIFY ========================

  async verifyTheLinkCopiedTextShouldBeDisplayed() {
    await expect(this.inviteByLinkCopyLinkBtn).toHaveText('Link copied');
  }

  private async verifyTheTitleShouldBeDisplayed() {
    const titleTxt = getInviteMembersInviteLink();
    await expect(
      this.inviteByLinkLbl,
      'Verify Invite colleagues by link title',
    ).toHaveText(titleTxt);
  }

  private async verifyTheInviteLinkInputFieldShouldBeDisplayed() {
    await expect(
      this.inviteByLinkInputField,
      'Verify Invite Link Input field',
    ).toBeVisible();
  }

  private async verifyTheCanTrainValueShouldBeDisplayed() {
    const text = getInviteMembersRolesPlayer();
    await expect(
      this.selectedRolePlayerLbl,
      'Verify the selected Role Player value',
    ).toHaveText(text);
  }

  private async verifyTheCopyInviteLinkButtonShouldBeDisplayed() {
    await expect(
      this.inviteByLinkCopyLinkBtn,
      'Verify Copy Invite Link button',
    ).toBeVisible();
  }

  async verifyTheInviteMemberByLinkShouldBeDisplayedCorrectly() {
    await this.verifyTheTitleShouldBeDisplayed();
    await this.verifyTheInviteLinkInputFieldShouldBeDisplayed();
    await this.verifyTheCanTrainValueShouldBeDisplayed();
    await this.verifyTheCopyInviteLinkButtonShouldBeDisplayed();
  }
}
