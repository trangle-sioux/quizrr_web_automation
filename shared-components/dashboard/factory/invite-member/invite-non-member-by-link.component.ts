import { expect, Locator, Page } from '@playwright/test';
import {
  getInviteMembersInviteNonEmailLink,
  getInviteMembersRolesPlayer,
} from '../../../../locales/dashboard/get-content';

export class InviteNonMemberByLinkComponent {
  private readonly inviteByLinkLbl: Locator;
  private readonly inviteByLinkBtn: Locator;
  private readonly inviteByLinkRolesPlayerLbl: Locator;
  private readonly inviteByLinkInputField: Locator;

  constructor(public readonly page: Page) {
    this.inviteByLinkLbl = this.page.getByTestId(
      'NonEmailPlayerInviteByLink-label',
    );
    this.inviteByLinkBtn = this.page.getByTestId(
      'NonEmailPlayerInviteByLink-button',
    );
    this.inviteByLinkInputField = this.page.getByTestId(
      'NonEmailPlayerInviteByLink-qrCodeLinkInput',
    );
    this.inviteByLinkRolesPlayerLbl = this.page.getByTestId(
      'NonEmailPlayerInviteByLink-rolesPlayerLabel',
    );
  }

  // ========================= ACTION ========================

  // ========================= VERIFY ========================
  private async verifyTheTitleShouldBeDisplayed() {
    const titleTxt = getInviteMembersInviteNonEmailLink();
    await expect
      .soft(
        this.inviteByLinkLbl,
        `Verify Invite link for colleagues who don't use email title`,
      )
      .toHaveText(titleTxt);
  }

  private async verifyTheQrCodeLinkInputFieldShouldBeDisplayed() {
    await expect
      .soft(this.inviteByLinkInputField, 'Verify QRCode Link Input field')
      .toBeVisible();
  }

  private async verifyTheCanTrainValueShouldBeDisplayed() {
    const text = getInviteMembersRolesPlayer();
    await expect
      .soft(
        this.inviteByLinkRolesPlayerLbl,
        'Verify the selected Role Player value',
      )
      .toHaveText(text);
  }

  private async verifyTheCopyInviteLinkButtonShouldBeDisplayed() {
    await expect
      .soft(this.inviteByLinkBtn, 'Verify Copy Invite Link button')
      .toBeVisible();
  }

  async verifyInviteNonMemberByLinkShouldBeDisplayedCorrectly() {
    await this.verifyTheTitleShouldBeDisplayed();
    await this.verifyTheQrCodeLinkInputFieldShouldBeDisplayed();
    await this.verifyTheCanTrainValueShouldBeDisplayed();
    await this.verifyTheCopyInviteLinkButtonShouldBeDisplayed();
  }
}
