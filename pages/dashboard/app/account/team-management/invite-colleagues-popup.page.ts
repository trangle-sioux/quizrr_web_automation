import { Locator, type Page } from '@playwright/test';
import { getCache } from '../../../../../utils';
import { LinkKey } from '../../../../../enums';
import {
  InviteMemberByEmailComponent,
  InviteMemberByLinkComponent,
  InviteNonMemberByLinkComponent,
} from '../../../../../shared-components/dashboard';
import { DashboardBasePage } from '../../../dashboard-base.page';

export class InviteColleaguesPopupPage extends DashboardBasePage {
  private readonly closeBtn: Locator;
  private inviteMemberByLinkCpt: InviteMemberByLinkComponent;
  private inviteMemberByEmailCpt: InviteMemberByEmailComponent;
  private inviteNonMemberByLinkCpt: InviteNonMemberByLinkComponent;

  constructor(public readonly page: Page) {
    super(page);
    this.closeBtn = this.page.getByTestId('InviteMembersPopup-closeButton');
    this.inviteMemberByLinkCpt = new InviteMemberByLinkComponent(page);
    this.inviteMemberByEmailCpt = new InviteMemberByEmailComponent(page);
    this.inviteNonMemberByLinkCpt = new InviteNonMemberByLinkComponent(page);
  }

  // ========================= ACTION ========================
  async openNewIncognitoAndGoWithTheLinkCopied(browser: any) {
    const copiedLink: string = getCache<string>(LinkKey.INVITE_BY_LINK);
    return super.openNewIncognitoAndGoWithTheLinkCopied(browser, copiedLink);
  }

  async getValueOfInviteByLinkInputWithAdminRole() {
    return await this.inviteMemberByLinkCpt.getValueOfInviteByLinkInputWithAdminRole();
  }

  async clickOnClosePopUpButton() {
    await this.closeBtn.click();
  }

  // ========================= VERIFY ========================
  async verifyTheInviteColleaguesByEmailComponentShouldBeDisplayedCorrectly() {
    await this.inviteMemberByEmailCpt.verifyInviteMemberByEmailShouldBeDisplayedCorrectly();
  }

  async verifyTheInviteColleaguesByLinkComponentShouldBeDisplayedCorrectly() {
    await this.inviteMemberByLinkCpt.verifyTheInviteMemberByLinkShouldBeDisplayedCorrectly();
  }

  async verifyTheInviteColleaguesWhoDoNotUseEmailByLinkComponentShouldBeDisplayedCorrectly() {
    await this.inviteNonMemberByLinkCpt.verifyInviteNonMemberByLinkShouldBeDisplayedCorrectly();
  }
}
