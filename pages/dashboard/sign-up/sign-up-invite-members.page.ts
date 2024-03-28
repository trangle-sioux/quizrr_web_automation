import { expect, Locator, Page } from '@playwright/test';
import { getInviteMembersTitle } from '../../../locales/dashboard/get-content';
import { BasePage } from '../../base.page';
import {
  InviteMemberByEmailComponent,
  InviteMemberByLinkComponent,
} from '../../../shared-components/dashboard';
import { getCache } from '../../../utils';
import { LinkKey } from '../../../enums';
import { WAIT_IN_10_SECOND } from '../../../constants';

export class SignUpInviteMemebersPage extends BasePage {
  private readonly inviteMemberTitleTxt: Locator;
  private readonly continueBtn: Locator;
  private inviteMemberByLinkCpt: InviteMemberByLinkComponent;
  private inviteMemberByEmailCpt: InviteMemberByEmailComponent;

  constructor(public readonly page: Page) {
    super(page);
    this.inviteMemberTitleTxt = this.page.getByTestId(
      'InviteMembersForm-title',
    );
    this.continueBtn = this.page.getByTestId(
      'InviteMembersForm-ContinueButton',
    );
    this.inviteMemberByEmailCpt = new InviteMemberByEmailComponent(page);
    this.inviteMemberByLinkCpt = new InviteMemberByLinkComponent(page);
  }

  // ========================= ACTION ========================
  async clickOnContinueButton() {
    await this.continueBtn.click({ timeout: WAIT_IN_10_SECOND });
  }

  async openNewIncognitoAndGoWithTheLinkCopied(browser: any) {
    const copiedLink: string = getCache<string>(LinkKey.INVITE_BY_LINK);
    return await super.openNewIncognitoAndGoWithTheLinkCopied(
      browser,
      copiedLink,
    );
  }

  async enterEmailInTheInviteColleaguesByEmailField(email: string) {
    await this.inviteMemberByEmailCpt.enterEmail(email);
  }

  async selectCanAdminOptionInTheInviteColleaguesByEmail() {
    await this.inviteMemberByEmailCpt.selectCanAdminOption();
  }

  async clickOnSendInvitesButton() {
    await this.inviteMemberByEmailCpt.clickOnSendInvitesButton();
  }

  async clickOnCopyInviteLinkButtonInTheInviteColleaguesByLink() {
    await this.inviteMemberByLinkCpt.clickOnCopyInviteLinkButton();
  }

  async selectCanAdminOptionInTheInviteColleaguesByLink() {
    await this.inviteMemberByLinkCpt.selectCanAdminOption();
  }

  // ========================= VERIFY ========================
  async verifyTheInviteMembersPageShoudlBeDisplayed() {
    const title = await getInviteMembersTitle();
    expect(this.inviteMemberTitleTxt).toHaveText(title);
  }

  async verifyTheLinkCopiedTextShouldBeDisplayedOnInviteLinkButton() {
    await this.inviteMemberByLinkCpt.verifyTheLinkCopiedTextShouldBeDisplayed();
  }
}
