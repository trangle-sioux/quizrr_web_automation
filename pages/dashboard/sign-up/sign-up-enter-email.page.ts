import { Page, Locator, BrowserContext, expect } from '@playwright/test';
import { DateTimeKey, LinkKey, TokenKey } from '../../../enums';
import {
  getPrivacyPolicyText,
  getTermsConditionsOfUseText,
} from '../../../locales/dashboard/get-content';
import {
  listInvalidEmailFormat,
  getRandomOwnerEmailAccount,
} from '../../../tests/data';
import {
  getCache,
  setCache,
  getRandomItemInList,
  environment as ENV,
  cacheAccessedToken,
} from '../../../utils';
import { BasePage } from '../../base.page';
import { PrivacyPolicyPage } from '../../quizrr-se/privacy-policy.page';
import { TermsAndConditionsOfUsePage } from '../../quizrr-se/terms-and-conditions-of-use.page';
import {
  SIGNUP_BY_INVITE_URL,
  SIGNUP_URL,
  WAIT_IN_10_SECOND,
} from '../../../constants';

export class SignUpEnterEmailPage extends BasePage {
  private readonly registrationProgressStepIcon: Locator;
  private readonly emailInputField: Locator;
  private readonly policyAgrementCheckBox: Locator;
  private readonly continueBtn: Locator;
  private readonly privacyPolicyLnk: Locator;
  private readonly termsConditionsLnk: Locator;
  private readonly signInLnk: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.registrationProgressStepIcon = this.page.locator(
      'svg[class*="RegistrationProgress__StepSVG"]',
    );
    this.emailInputField = this.page.getByTestId('email');
    this.policyAgrementCheckBox = this.page.getByTestId(
      'policyAndTermAgreement',
    );
    this.privacyPolicyLnk = this.page.getByRole('link', {
      name: getPrivacyPolicyText(),
      exact: true,
    });
    this.termsConditionsLnk = this.page.getByRole('link', {
      name: getTermsConditionsOfUseText(),
    });
    this.continueBtn = this.page.getByTestId('SignUpForm-ContinueBtn');
    this.signInLnk = this.page.getByTestId('SignUpForm-signInLink');
  }

  // ==================== ACTION ===========================

  async goToThePageWithTheSignUpToken(token: string) {
    const url: string = `${SIGNUP_URL}=${token}`;
    await super.goto(url);
    cacheAccessedToken(ENV.SIGN_UP_TOKEN_OWNER_ACC_1);
  }

  async goToThePageWithTheInviteToken(token: string) {
    const url: string = `${SIGNUP_BY_INVITE_URL}=${token}`;
    await super.goto(url);
  }

  async enterEmailAddress(email: string) {
    await this.emailInputField.isVisible({ timeout: WAIT_IN_10_SECOND });
    await this.emailInputField.fill(email);
  }

  async enterIncorrectEmailFormat() {
    const incorrectFormatEmail = getRandomItemInList(listInvalidEmailFormat);
    await this.enterEmailAddress(incorrectFormatEmail);
  }

  async enterAnExistingEmail() {
    const existingEmail = getRandomOwnerEmailAccount();
    await this.enterEmailAddress(existingEmail);
  }

  async aggreePolicy() {
    await this.policyAgrementCheckBox.click();
  }

  async clickContinueBtn() {
    await this.continueBtn.click();
    setCache(DateTimeKey.SEND_OTP_CODE_EMAIL, new Date());
  }

  async clickOnPrivacypolicyLink() {
    await this.privacyPolicyLnk.click();
  }

  async clickOnTermsAndConditionsOfUseLink() {
    await this.termsConditionsLnk.click();
  }

  async naviagteToPrivacyPolicyPage(context: BrowserContext) {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      // This action triggers the new tab
      await this.clickOnPrivacypolicyLink(),
      await this.page.waitForLoadState(),
    ]);
    // Return POM for the new tab
    return new PrivacyPolicyPage(newPage);
  }

  async navigateToTermsAndConditionsPage(context: BrowserContext) {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      // This action triggers the new tab
      await this.clickOnTermsAndConditionsOfUseLink(),
      await this.page.waitForLoadState(),
    ]);
    // Return POM for the new tab
    return new TermsAndConditionsOfUsePage(newPage);
  }

  async clickOnSignInLink() {
    await this.signInLnk.click();
  }

  async signUpWithValidEmailAccount(email: string) {
    await this.enterEmailAddress(email);
    await this.aggreePolicy();
    await this.clickContinueBtn();
  }

  async bypassEnterEmailPageByEmailAddress(email: string) {
    await this.goToThePageWithTheSignUpToken(ENV.SIGN_UP_TOKEN_OWNER_ACC_1);
    await this.signUpWithValidEmailAccount(email);
  }

  // ========================= VERIFY ========================
  async verifyContinueButtonShouldBeDisabled() {
    await expect(this.continueBtn).toBeDisabled();
  }

  async verifyTheSignUpPlayerPageShouldBeDisplayed() {
    const url = getCache<string>(LinkKey.INVITE_BY_LINK);
    await expect(this.page).toHaveURL(url);
    await expect(this.registrationProgressStepIcon).toHaveCount(3);
  }

  async verifyTheSignUpAdminPageShouldBeDisplayed() {
    const url = getCache<string>(LinkKey.INVITE_BY_LINK);
    await expect(this.page).toHaveURL(url);
    await expect(this.registrationProgressStepIcon).toHaveCount(4);
  }
}
