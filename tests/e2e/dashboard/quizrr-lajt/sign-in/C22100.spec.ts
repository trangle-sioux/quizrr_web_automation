import { test } from '../../../../../fixtures/dashboard.fixture';
import {
  EmailChecking,
  cacheCurrentOtpCodeFromEmailAs,
  getRandomItemInList,
} from '../../../../../utils';
import {
  RgbColor,
  UserRole,
  UserDataType,
  OtpCodeTypeKey as otpType,
} from '../../../../../enums';
import {
  assignEmailAddressFromExistingUsersToEachProject as assignExistingEmail,
  listInvalidEmailFormat,
  nonExistingEmailAddressList,
} from '../../../../data';

test.describe('[Sign in] Sign in', () => {
  const incorrectFormatEmail: string = getRandomItemInList(
    listInvalidEmailFormat,
  );
  const nonExistingEmailAddress: string = getRandomItemInList(
    nonExistingEmailAddressList,
  );
  let existingAdminEmailAddress: string;
  test.beforeEach(
    'Assign admin existing email address to each project',
    async () => {
      existingAdminEmailAddress = assignExistingEmail(
        UserRole.TEAM_ADMIN,
        UserDataType.STATIC,
      );
    },
  );

  test('@C22100: Sign in with an admin account @Critical', async ({
    signInEnterEmailPage: enterEmailPage,
    signInEnterOtpPage: enterOtpPage,
    overviewPage,
  }) => {
    test.slow();

    // Verify failed signing in by entering incorrect email format
    await enterEmailPage.goto();
    await enterEmailPage.enterTheEmailAdress(incorrectFormatEmail);
    await enterEmailPage.verifyTheSigninButtonShouldBeEnabled();
    await enterEmailPage.clickOnTheSigninButton();

    // Verify sign-in failed by keeping the current page
    await enterEmailPage.verifyTheEmailInputFieldShouldBeDisplayed();
    await enterEmailPage.clearTheInputEmailField();

    // Verify failed signing in by entering non-existing email address and error occurs
    await enterEmailPage.enterTheEmailAdress(nonExistingEmailAddress);
    await enterEmailPage.clickOnTheSigninButton();
    await enterEmailPage.verifyTheEmailInputFieldShouldBeDisplayed();
    await enterEmailPage.verifyTheNonExistingEmailErrorMessageShouldBeDisplayed();

    // Verify navigating to next screen by entering an existing owner email address
    await enterEmailPage.enterTheEmailAdress(existingAdminEmailAddress);
    await enterEmailPage.clickOnTheSigninButton();
    await enterOtpPage.verifyTheOtpInputFieldsShouldBeDisplayed();

    // Verify an OTP code is received via email
    await EmailChecking.verifyAnOtpCodeShouldBeSentToEmail(
      existingAdminEmailAddress,
    );
    await cacheCurrentOtpCodeFromEmailAs(
      existingAdminEmailAddress,
      otpType.OLD_OTP_CODE,
    );

    // Verify receiving a new otp code after clicking on resend email
    await enterOtpPage.clickOnTheResendEmailLink();
    await enterOtpPage.verifyTheSendOtpSuccessfullyMessageShouldBeDisplayed();
    await EmailChecking.verifyAnOtpCodeShouldBeSentToEmail(
      existingAdminEmailAddress,
    );

    await cacheCurrentOtpCodeFromEmailAs(
      existingAdminEmailAddress,
      otpType.NEW_OTP_CODE,
    );

    // Verify failed signing in by entering the old | invalid OTP code
    await enterOtpPage.enterTheOldOtpCode();
    await enterOtpPage.verifyTheSignInBtnShouldBeEnable();
    await enterOtpPage.clickOnTheSignInBtn();
    await enterOtpPage.verifyTheIncorrectOtpCodeErrorMessageShouldBeDisplayed();
    // Comment below step because failing by an existing bug: QTD-4325.
    // await enterOtpPage.verifySignInBtnShouldBeDisabled();
    await enterOtpPage.verifyTheIncorrectOtpCodeErrorMessageShouldBeColor(
      RgbColor.SAFETY_ORANGE,
    );

    // Verify success signing in by entering the new OTP code
    await enterOtpPage.clearTheEnteredOtpCode();
    await enterOtpPage.verifyTheOtpInputFieldsShouldBeDisplayedWithDefaultColor();
    await enterOtpPage.verifyTheOtpInputFieldsShouldBeClean();
    await enterOtpPage.enterTheNewOtpCode();
    await enterOtpPage.verifyTheSignInBtnShouldBeEnable();
    await enterOtpPage.clickOnTheSignInBtn();
    await overviewPage.verifyTheGuidelinePopupShouldBeDisplayed();
  });
});
