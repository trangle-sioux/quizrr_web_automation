import { expect, Locator, type Page } from '@playwright/test';
import { User } from '../../../services/user.service';
import {
  getSendVerificationCodeSuccess,
  getResendVerificationCodeText,
  getErrorCodeInvalidOtpMsg,
  getSignInButtonText,
} from '../../../locales/dashboard/get-content';
import { getElementStyle } from '../../elements/attribute.element';
import { REGEX_OPENING_CLOSING_TAG_0 } from '../../../constants';
import {
  RgbColor,
  ElementStyleProperty,
  DateTimeKey,
  OtpCodeTypeKey,
} from '../../../enums';
import {
  getOtpCodeFromCache,
  setCache,
  extractString,
  EmailChecking,
} from '../../../utils';

export type SignInEnterOtpPageContent = {
  signInBtnTxt: string;
  resendEmailTxt: string;
  sendOtpSuccessTxt: string;
  invalidOtpTxt: string;
};

export class SignInEnterOtpPage {
  private readonly otpInputFields: (index: string) => Locator;
  private readonly signInBtn: Locator;
  private readonly resendEmailLink: Locator;
  private readonly sendOtpSuccessMsg: Locator;
  private readonly incorrectOtpCodeErrorMsg: Locator;
  private readonly user = new User();

  constructor(public readonly page: Page) {
    this.otpInputFields = (index: string) =>
      this.page.getByTestId(`OTP-6-pinInput-${index}`);
    this.signInBtn = this.page.getByRole('button', {
      name: getSignInButtonText(),
    });
    this.resendEmailLink = this.page.getByText(
      extractString(
        getResendVerificationCodeText(),
        REGEX_OPENING_CLOSING_TAG_0,
      ) ?? '',
    );
    this.sendOtpSuccessMsg = this.page.getByText(
      getSendVerificationCodeSuccess(),
    );
    this.incorrectOtpCodeErrorMsg = this.page.getByText(
      getErrorCodeInvalidOtpMsg(),
    );
  }

  // ========================= ACTIONS ========================

  async enterOtpCodeGetFromDatabase(receiverEmail: string) {
    const otpCode = (
      await this.getOtpCodeFromDatabase(receiverEmail)
    ).toString();
    await this.enterTheOtpCode(otpCode);
  }

  async enterTheOtpCodeFromEmail(receiverEmail: string) {
    const otpCode = await EmailChecking.getOtpCodeFromEmail(receiverEmail);
    await this.enterTheOtpCode(otpCode);
  }

  async enterTheOtpCode(otpCode: string) {
    const codes = otpCode.split('');
    for (let i = 0; i < codes.length; i++) {
      await this.otpInputFields(i.toString()).fill(codes[i]);
    }
  }

  // Pre-condition: must cache the old OTP code in a previous step in the key OtpCodeTypeKey.OLD_OTP_CODE
  async enterTheOldOtpCode() {
    await this.enterTheOtpCode(
      getOtpCodeFromCache(OtpCodeTypeKey.OLD_OTP_CODE),
    );
  }

  // Pre-condition: must cache the new OTP code in a previous step in the key OtpCodeTypeKey.NEW_OTP_CODE
  async enterTheNewOtpCode() {
    await this.enterTheOtpCode(
      getOtpCodeFromCache(OtpCodeTypeKey.NEW_OTP_CODE),
    );
  }

  async clearTheEnteredOtpCode() {
    for (let i = 0; i < 6; i++) {
      await this.otpInputFields('0').clear();
    }
  }

  async clickOnTheSignInBtn() {
    await this.signInBtn.click();
  }

  async clickOnTheResendEmailLink() {
    setCache(DateTimeKey.SEND_OTP_CODE_EMAIL, new Date());
    await this.resendEmailLink.click();
  }

  async submitAnOtpCodeFromEmail(email: string) {
    await this.enterTheOtpCodeFromEmail(email);
    await this.clickOnTheSignInBtn();
  }
  // ========================= VERIFY ========================

  async verifyTheOtpInputFieldsShouldBeDisplayed() {
    for (let i = 0; i < 6; i++) {
      await expect(this.otpInputFields(i.toString())).toBeVisible();
    }
  }

  async verifyTheOtpInputFieldsShouldBeClean() {
    for (let i = 0; i < 6; i++) {
      await expect(this.otpInputFields(i.toString())).toBeEmpty();
    }
  }

  async verifyTheOtpInputFieldsShouldBeDisplayedWithDefaultColor() {
    for (let i = 0; i < 6; i++) {
      // first field is blue (rgb(13, 110, 253)) because of choosing, other is gray
      const colorStyle = await getElementStyle(
        this.otpInputFields(i.toString()),
        ElementStyleProperty.BORDER_COLOR,
      );
      if (i === 0) expect(colorStyle.value).toBe(RgbColor.LIGHT_BLUE_SKY);
      else expect(colorStyle.value).toBe(RgbColor.CEREBRAL_GREY);
    }
  }

  async verifyTheSendOtpSuccessfullyMessageShouldBeDisplayed() {
    await expect(this.sendOtpSuccessMsg).toBeVisible();
  }

  async verifyTheSignInBtnShouldBeEnable() {
    await expect(this.signInBtn).toBeEnabled();
  }

  async verifyTheSignInBtnShouldBeDisabled() {
    await expect(this.signInBtn).toBeDisabled();
  }

  async verifyTheIncorrectOtpCodeErrorMessageShouldBeDisplayed() {
    await expect(this.incorrectOtpCodeErrorMsg).toBeVisible();
  }

  async verifyTheIncorrectOtpCodeErrorMessageShouldBeColor(colorValue: string) {
    const colorStyle = await getElementStyle(
      this.incorrectOtpCodeErrorMsg,
      ElementStyleProperty.COLOR,
    );
    expect(colorStyle.value).toBe(colorValue);
  }

  // ========= GET DATA =========

  async getOtpCodeFromDatabase(emailAddress: string): Promise<string> {
    return this.user.getCodeByEmailAdress(emailAddress);
  }
}
