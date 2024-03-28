import { expect, Locator, Page } from '@playwright/test';
import { setCache, EmailChecking, getOtpCodeFromCache } from '../../../utils';
import { BasePage } from '../../base.page';
import {
  RgbColor,
  DateTimeKey,
  ElementStyleProperty,
  OtpCodeTypeKey,
} from '../../../enums';
import {
  getVerificationTitle,
  getErrorCodeInvalidOtpMsg,
} from '../../../locales/dashboard/get-content';

export class SignUpEnterOtpPage extends BasePage {
  private readonly otpInputFields: (index: string) => Locator;
  private readonly signUpBtn: Locator;
  private readonly titleTxt: Locator;
  private readonly resendEmailLnk: Locator;
  private readonly errorMsg: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.otpInputFields = (index: string) =>
      this.page.getByTestId(`OTP-6-pinInput-${index}`);
    this.signUpBtn = this.page.getByTestId('OTPPinCode-submitButton');
    this.titleTxt = this.page.getByTestId('VerificationForm-title');
    this.resendEmailLnk = this.page.getByTestId('OTPPinCode-resendEmailLink');
    this.errorMsg = this.page.getByTestId('OTPPinCode-errorMessage');
  }

  async clickOnSignUpBtn() {
    await this.signUpBtn.click();
  }

  async enterOtpCodeOfEmail(receiverEmail: string) {
    const otpCode = await EmailChecking.getOtpCodeFromEmail(receiverEmail);
    await this.enterOtpCode(otpCode);
  }

  async enterOtpCode(otpCode: string) {
    const codes = otpCode.split('');
    for (let i = 0; i < codes.length; i++) {
      await this.otpInputFields(i.toString()).fill(codes[i]);
    }
  }

  async clickOnResendEmailLink() {
    await this.resendEmailLnk.click();
    //store time after clicking on resend EmailLink
    setCache(DateTimeKey.SEND_OTP_CODE_EMAIL, new Date());
  }

  async enterOldOtpNumber() {
    const oldOtp = getOtpCodeFromCache(OtpCodeTypeKey.OTP_CODE);
    this.enterOtpCode(oldOtp);
  }

  async clearEnteredOtpCode() {
    for (let i = 0; i < 6; i++) {
      await this.otpInputFields('0').clear();
    }
  }

  async submitCorrectOtpCodeFromEmail(email: string) {
    await this.enterOtpCodeOfEmail(email);
    await this.clickOnSignUpBtn();
  }

  // ====================== VERIFY ===================
  async verifyTheVerificationPageShouldBeDisplayed() {
    const title = await getVerificationTitle();
    await expect(this.titleTxt).toHaveText(title);
  }

  async verifySignUpButtonShouldBeEnabled() {
    await expect(this.signUpBtn).toBeEnabled();
  }

  async verifyOneTimePasswordErrorMessageShouldBeDisplayed() {
    const errorMessage: string = await getErrorCodeInvalidOtpMsg();
    await expect(this.errorMsg).toHaveText(errorMessage);
  }

  async verifyOtpFieldsShouldBeChangedToOrangeColor() {
    for (let i = 0; i < 6; i++) {
      const otpInputField = this.otpInputFields(i.toString());
      await expect(otpInputField).toHaveCSS(
        ElementStyleProperty.BORDER_COLOR,
        RgbColor.SAFETY_ORANGE,
      );
    }
  }

  async verifySignUpButtonShouldBeDisabled() {
    await expect(this.signUpBtn).toBeDisabled();
  }

  async verifyOtpFieldsShouldBeChangedToDefault() {
    for (let i = 0; i < 6; i++) {
      const otpInputField = this.otpInputFields(i.toString());
      // Handle here because the first input field is selected
      if (i == 0) {
        await expect(otpInputField).toHaveCSS(
          ElementStyleProperty.BORDER_COLOR,
          RgbColor.LIGHT_BLUE_SKY,
        );
      } else {
        await expect(otpInputField).toHaveCSS(
          ElementStyleProperty.BORDER_COLOR,
          RgbColor.CEREBRAL_GREY,
        );
      }
    }
  }
}
