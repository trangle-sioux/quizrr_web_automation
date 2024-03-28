import { AccountRole } from '../../../../../enums';
import { test } from '../../../../../fixtures/dashboard.fixture';
import {
  EmailChecking,
  gmailUtil,
  environment as ENV,
} from '../../../../../utils';

test.describe('[Sign up] Role', () => {
  let playerEmailAddress: string;

  test.beforeEach(
    'generate a new player email address for each project',
    async ({}, testInfo) => {
      playerEmailAddress = gmailUtil.generateNewEmailAddressForEachProject(
        ENV.TESTING_EMAIL_ADDRESS_1,
        AccountRole.PLAYER,
        testInfo.project.name,
      );
    },
  );
  test('@C22045: Sign up a player account @Critical', async ({
    context,
    privacyPolicyPage,
    termsAndConditionsPage,
    signInEnterEmailPage,
    signUpEnterEmailPage,
    signUpEnterOtpPage,
    congratulationPage,
    welcomePage: webBasedWelcomePage,
  }) => {
    test.slow();
    await signUpEnterEmailPage.goToThePageWithTheInviteToken(
      ENV.INVITE_TOKEN_PLAYER_ACC_1,
    );

    // Verify the Privacy Policy page is displayed after clicking on the Privacy Policy hyperlink
    privacyPolicyPage = await signUpEnterEmailPage.naviagteToPrivacyPolicyPage(
      context,
    );
    await privacyPolicyPage.verifyThePrivacyPolicyPageIsDisplayed();
    await privacyPolicyPage.close();

    // Verify the Terms And Conditions page is displayed after clicking on the Terms And Conditions hyperlink
    termsAndConditionsPage =
      await signUpEnterEmailPage.navigateToTermsAndConditionsPage(context);
    await termsAndConditionsPage.verifyTheTermsAndConditionsOfUsePageIsDisplayed();
    await termsAndConditionsPage.close();

    // Verify the Sign in page is displayed after clicking on the Sign in hyperlink
    await signUpEnterEmailPage.clickOnSignInLink();
    await signInEnterEmailPage.verifyTheSignInPageShouldBeDisplayed();

    // Back to Sign up page
    await signInEnterEmailPage.goBack();

    // Verify the continue button is disabled when entering a wrong email format
    await signUpEnterEmailPage.enterIncorrectEmailFormat();
    await signUpEnterEmailPage.verifyContinueButtonShouldBeDisabled();

    // Verify the continue button is still disabled even after agreeing with the policy
    await signUpEnterEmailPage.aggreePolicy();
    await signUpEnterEmailPage.verifyContinueButtonShouldBeDisabled();

    // Verify redirecting to the Sign In page and show an error when continuing with an existing email
    await signUpEnterEmailPage.enterAnExistingEmail();
    await signUpEnterEmailPage.clickContinueBtn();
    await signInEnterEmailPage.verifyTheSignInPageShouldBeDisplayed();
    await signInEnterEmailPage.verifyTheExistingEmailErrorMessageShouldBeDisplayed();

    // Back to Sign up page
    await signInEnterEmailPage.goBack();

    // Verify redirecting to the Verification page and receiving an OTP code via email when continuing with a new valid email address
    await signUpEnterEmailPage.signUpWithValidEmailAccount(playerEmailAddress);
    await signUpEnterOtpPage.verifyTheVerificationPageShouldBeDisplayed();
    await EmailChecking.verifyAnOtpCodeShouldBeSentToEmail(playerEmailAddress);

    // Verify the previous OTP code is invalid after clicking on the Resend email hyperlink
    await signUpEnterOtpPage.clickOnResendEmailLink();
    await signUpEnterOtpPage.enterOldOtpNumber();
    await signUpEnterOtpPage.verifySignUpButtonShouldBeEnabled();
    await signUpEnterOtpPage.clickOnSignUpBtn();
    await signUpEnterOtpPage.verifyOneTimePasswordErrorMessageShouldBeDisplayed();
    await signUpEnterOtpPage.verifyOtpFieldsShouldBeChangedToOrangeColor();

    // TODO: un-comment this step when the QTD-4325 bug has fix
    // await signUpEnterOtpPage.verifySignUpButtonShouldBeDisabled();

    // Verify the OTP fields reset to the default color after removing the entered OTP code
    await signUpEnterOtpPage.clearEnteredOtpCode();
    await signUpEnterOtpPage.verifyOtpFieldsShouldBeChangedToDefault();

    // Verify redirecting to the Congratulation! page after entering the new OTP code from the email
    await signUpEnterOtpPage.enterOtpCodeOfEmail(playerEmailAddress);
    await signUpEnterOtpPage.verifySignUpButtonShouldBeEnabled();
    await signUpEnterOtpPage.clickOnSignUpBtn();
    await congratulationPage.verifyTheCongratulationsPageShouldBeDisplayed();

    // Verify navigating to the web-based training after clicking on the start training button
    await congratulationPage.clickOnTheStartTrainingButton();
    await webBasedWelcomePage.verifyTheWelcomePageShouldBeDisplayed();
  });
});
