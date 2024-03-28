import { expect, test } from '../../../../../fixtures/dashboard.fixture';
import {
  EmailChecking,
  cacheCurrentOtpCodeFromEmailAs,
  delay,
  getOtpCodeFromCache,
  getRandomItemInList,
  environment as ENV,
} from '../../../../../utils';
import {
  RgbColor,
  UserRole,
  UserDataType,
  UrlSubdirectory,
  OtpCodeTypeKey as otpType,
} from '../../../../../enums';
import {
  assignEmailAddressFromExistingUsersToEachProject as assignExistingEmail,
  listInvalidEmailFormat,
  nonExistingEmailAddressList,
} from '../../../../data';
import { OVERVIEW_PAGE_URL } from '../../../../../constants';

test.describe('[Sign in] Sign in', () => {
  const wrongFormatEmailAddress: string = getRandomItemInList(
    listInvalidEmailFormat,
  );
  const nonExistingEmailAddress: string = getRandomItemInList(
    nonExistingEmailAddressList,
  );
  let existingOwnerEmailAddress: string;
  test.beforeEach(
    'Assign existing a player email address to each project',
    async () => {
      existingOwnerEmailAddress = assignExistingEmail(
        UserRole.ACCOUNT_PLAYER,
        UserDataType.STATIC,
      );
    },
  );

  test('@C22099: Sign in with a player account @Critical', async ({
    signInEnterEmailPage: enterEmailPage,
    signInEnterOtpPage: enterOtpPage,
    goToTrainingPage,
    welcomePage: webBasedWelcome,
  }) => {
    test.slow();

    // Verify failed signing in by entering wrong email format
    await enterEmailPage.goto();
    await enterEmailPage.enterTheEmailAdress(wrongFormatEmailAddress);
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
    await enterEmailPage.enterTheEmailAdress(existingOwnerEmailAddress);
    await enterEmailPage.clickOnTheSigninButton();
    await enterOtpPage.verifyTheOtpInputFieldsShouldBeDisplayed();
    // Verify an OTP code is received via email
    await EmailChecking.verifyAnOtpCodeShouldBeSentToEmail(
      existingOwnerEmailAddress,
    );
    await cacheCurrentOtpCodeFromEmailAs(
      existingOwnerEmailAddress,
      otpType.OLD_OTP_CODE,
    );

    // Verify receiving a new otp code after clicking on resend email
    await enterOtpPage.clickOnTheResendEmailLink();
    await enterOtpPage.verifyTheSendOtpSuccessfullyMessageShouldBeDisplayed();

    // Must add the waiting period to ensure receiving the new mail (the same receiver and received time as the previous one)
    await delay(4000);
    await EmailChecking.verifyAnOtpCodeShouldBeSentToEmail(
      existingOwnerEmailAddress,
    );
    await cacheCurrentOtpCodeFromEmailAs(
      existingOwnerEmailAddress,
      otpType.NEW_OTP_CODE,
    );
    expect(getOtpCodeFromCache(otpType.OLD_OTP_CODE)).not.toBe(
      getOtpCodeFromCache(otpType.NEW_OTP_CODE),
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

    // Verify go to web-base training after clicking on the Go To Training button
    await goToTrainingPage.clickOnTheGoToTrainingButton();
    await webBasedWelcome.verifyTheWelcomePageShouldBeDisplayed();
    await webBasedWelcome.closeTheWebBasedTrainingPopup();

    // Verify just refreshes the goToTrainingPage when reloading page with the overview url
    await goToTrainingPage.goto(OVERVIEW_PAGE_URL);
    await goToTrainingPage.verifyTheGoToTrainingPageShouldBeDisplayed();
  });
});
