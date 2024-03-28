import { AccountRole } from '../../../../../enums/user-account/role.enum';
import { SignUpEnterEmailPage } from '../../../../../pages/dashboard/sign-up';
import { EmailChecking } from '../../../../../utils';
import { delay, generateTeamName } from '../../../../../utils/common.util';
import { environment as ENV } from '../../../../../utils/environment.util';
import { gmailUtil } from '../../../../../utils/gmail/gmail.util';
import { test } from '../../../../../fixtures/dashboard.fixture';

test.describe('[Sign up] Role', () => {
  let userEmailAdress: string;
  let adminEmailAdress: string;
  let inviteAdminLink: string;
  let teamNameValue: string;

  test.beforeEach(
    'Get admin sign-up link from invitation of owner account',
    async (
      {
        factoryPage,
        teamManagementPage,
        inviteColleaguesPopupPage,
        theUserLoggedInSuccessfullyWithDynamicTypeExistingOwnerEmail:
          theUserLoggedInSuccessfully,
      },
      testInfo,
    ) => {
      // Generate Team name
      teamNameValue = generateTeamName(testInfo.project.name);

      // Generate admin email adress to each project
      adminEmailAdress = gmailUtil.generateNewEmailAddressForEachProject(
        ENV.TESTING_EMAIL_ADDRESS_1,
        AccountRole.TEAM_ADMIN,
        testInfo.project.name,
      );

      // Generate user email adress to each project
      userEmailAdress = gmailUtil.generateNewEmailAddressForEachProject(
        ENV.TESTING_EMAIL_ADDRESS_1,
        AccountRole.USER,
        testInfo.project.name,
      );

      theUserLoggedInSuccessfully;
      await factoryPage.closeGuidelinePopup();
      await factoryPage.gotoTeamManagementPage();
      await teamManagementPage.clickOnInviteColleaguesButtonOfYourColleaguesTab();
      inviteAdminLink =
        await inviteColleaguesPopupPage.getValueOfInviteByLinkInputWithAdminRole();
      await inviteColleaguesPopupPage.clickOnClosePopUpButton();
      await factoryPage.logout();

      // Handle here to wait data is cleared after logout. Avoid the 'Failed to load' error displays
      // when navigate to copied link
      await delay(2000);
    },
  );

  test('@C22044: Sign up an admin account @Critical', async ({
    context,
    browser,
    signUpEnterEmailPage,
    signUpEnterOtpPage,
    signUpCreateFacilityTeamPage,
    signUpInviteMembersPage,
    signInEnterEmailPage,
    privacyPolicyPage,
    termsAndConditionsPage,
    factoryPage,
  }) => {
    test.setTimeout(300000);

    await signUpEnterEmailPage.goto(inviteAdminLink);

    // Click on Privacy Policy link and then verify the Privacy Policy page is displayed
    privacyPolicyPage = await signUpEnterEmailPage.naviagteToPrivacyPolicyPage(
      context,
    );
    await privacyPolicyPage.verifyThePrivacyPolicyPageIsDisplayed();
    await privacyPolicyPage.close();

    // Click on Terms And Conditions link and then verify the Terms And Conditions Of Use page is displayed
    termsAndConditionsPage =
      await signUpEnterEmailPage.navigateToTermsAndConditionsPage(context);
    await termsAndConditionsPage.verifyTheTermsAndConditionsOfUsePageIsDisplayed();
    await termsAndConditionsPage.close();

    // Click on the Sign in hyperlink and then verify the Sign in page is displayed
    await signUpEnterEmailPage.clickOnSignInLink();
    await signInEnterEmailPage.verifyTheSignInPageShouldBeDisplayed();

    // Back to Sign up page
    await signInEnterEmailPage.goBack();

    // Enter incorrect email format and then verify the Continue button is disabled
    await signUpEnterEmailPage.enterIncorrectEmailFormat();
    await signUpEnterEmailPage.verifyContinueButtonShouldBeDisabled();

    // Agree to Quizrr's Terms and Conditions and Privacy Policy checkbox and then verify the Continue is disabled
    await signUpEnterEmailPage.aggreePolicy();
    await signUpEnterEmailPage.verifyContinueButtonShouldBeDisabled();

    // Enter an existing email then clicking on Continue button
    await signUpEnterEmailPage.enterAnExistingEmail();
    await signUpEnterEmailPage.clickContinueBtn();

    // Verify if it redirect to Sign In page and display the existing email error message
    await signInEnterEmailPage.verifyTheSignInPageShouldBeDisplayed();
    await signInEnterEmailPage.verifyTheExistingEmailErrorMessageShouldBeDisplayed();

    // Back to Sign up page
    await signInEnterEmailPage.goBack();

    // Sign in with valid account and then verify the Verification page is displayed and an OTP is sent to email
    await signUpEnterEmailPage.signUpWithValidEmailAccount(adminEmailAdress);
    await signUpEnterOtpPage.verifyTheVerificationPageShouldBeDisplayed();
    await EmailChecking.verifyAnOtpCodeShouldBeSentToEmail(adminEmailAdress);

    // Click on Resend email link
    await signUpEnterOtpPage.clickOnResendEmailLink();

    // Enter old OTP and then verify the Sign Up button is enabled
    await signUpEnterOtpPage.enterOldOtpNumber();
    await signUpEnterOtpPage.verifySignUpButtonShouldBeEnabled();

    // Click on Sign up button and then verify the error message is displayed
    // And verify the otp fieds change to Orange color
    await signUpEnterOtpPage.clickOnSignUpBtn();
    await signUpEnterOtpPage.verifyOneTimePasswordErrorMessageShouldBeDisplayed();
    await signUpEnterOtpPage.verifyOtpFieldsShouldBeChangedToOrangeColor();

    // TODO: un-comment this step when the QTD-4325 bug has fix
    // await signUpEnterOtpPage.verifySignUpButtonShouldBeDisabled();

    // Clear OTP and then verify the OTP fields reset to the default
    await signUpEnterOtpPage.clearEnteredOtpCode();
    await signUpEnterOtpPage.verifyOtpFieldsShouldBeChangedToDefault();

    // Submit correct OTP code and then verify it redirects to the Team page
    await signUpEnterOtpPage.enterOtpCodeOfEmail(adminEmailAdress);
    await signUpEnterOtpPage.verifySignUpButtonShouldBeEnabled();
    await signUpEnterOtpPage.clickOnSignUpBtn();
    await signUpCreateFacilityTeamPage.verifyTheFacilityTeamNameShouldBeDisplayed();

    // Enter name of organization
    await signUpCreateFacilityTeamPage.enterYourTeamName(teamNameValue);

    // Click on Continue button and then verify it redirects to Invite Members page
    await signUpCreateFacilityTeamPage.clickOnTheContinueButton();
    await signUpInviteMembersPage.verifyTheInviteMembersPageShoudlBeDisplayed();

    // Enter user email to invite colleagues email field
    await signUpInviteMembersPage.enterEmailInTheInviteColleaguesByEmailField(
      userEmailAdress,
    );

    // Click on send invite button and then verify the the training invite email is sent to user email
    await signUpInviteMembersPage.clickOnSendInvitesButton();
    await EmailChecking.verifyTheTrainingInviteShouldBeSentToEmail(
      userEmailAdress,
    );

    // Click on Invite link button and then verify the link copied text is displayed
    await signUpInviteMembersPage.clickOnCopyInviteLinkButtonInTheInviteColleaguesByLink();
    await signUpInviteMembersPage.verifyTheLinkCopiedTextShouldBeDisplayedOnInviteLinkButton();

    // Open incognito browser and the verify the sign in player page is displayed
    const newPlayerContext =
      await signUpInviteMembersPage.openNewIncognitoAndGoWithTheLinkCopied(
        browser,
      );
    signUpEnterEmailPage = new SignUpEnterEmailPage(newPlayerContext);
    await signUpEnterEmailPage.verifyTheSignUpPlayerPageShouldBeDisplayed();
    signUpEnterEmailPage.close();

    // Click on Continue button and then verify the Dashboard page is displayed
    await signUpInviteMembersPage.clickOnContinueButton();
    await factoryPage.verifyTheFactoryPageShouldBeDisplayed();
  });
});
