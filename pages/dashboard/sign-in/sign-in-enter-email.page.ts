import { Locator, Page, expect } from '@playwright/test';
import { environment as ENV, setCache } from '../../../utils';
import { BasePage } from '../../base.page';
import {
  getErrorCode409,
  getSignInButtonText,
  getErrorCode404Msg,
} from '../../../locales/dashboard/get-content';
import { DateTimeKey } from '../../../enums';

export class SignInEnterEmailPage extends BasePage {
  private readonly emailInputField: Locator;
  private readonly signInBtn: Locator;
  private readonly validatedEmailErrorMsg: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.emailInputField = this.page.getByTestId('email');
    this.validatedEmailErrorMsg = this.page.getByTestId(
      'SignInForm-errorMessage',
    );
    this.emailInputField = this.page.getByTestId('email');
    this.signInBtn = this.page.getByRole('button', {
      name: getSignInButtonText(),
    });
  }

  // ========================= ACTIONS ========================

  async goto() {
    await super.goto(ENV.DASHBOARD_URL);
  }

  async enterTheEmailAdress(email: string) {
    await this.emailInputField.fill(email);
  }

  async clearTheInputEmailField() {
    await this.emailInputField.clear();
  }

  async clickOnTheSigninButton() {
    await this.signInBtn.click();
    setCache(DateTimeKey.SEND_OTP_CODE_EMAIL, new Date());
  }

  async signInWithTheEmail(email: string) {
    await this.goto();
    await this.enterTheEmailAdress(email);
    await this.clickOnTheSigninButton();
  }

  // ====================== VERIFY ===================
  async verifyTheSignInPageShouldBeDisplayed() {
    await expect(this.page).toHaveURL(/.*signin/);
  }

  async verifyTheExistingEmailErrorMessageShouldBeDisplayed() {
    const errorMessage: string = getErrorCode409();
    await expect(this.validatedEmailErrorMsg).toHaveText(errorMessage);
  }

  async verifyTheNonExistingEmailErrorMessageShouldBeDisplayed() {
    const errorMessage: string = getErrorCode404Msg();
    await expect(this.validatedEmailErrorMsg).toHaveText(errorMessage);
  }

  async verifyTheSigninButtonShouldBeEnabled() {
    await expect(this.signInBtn).toBeEnabled();
  }

  async verifyTheEmailInputFieldShouldBeDisplayed() {
    await expect(this.emailInputField).toBeVisible();
  }
}
