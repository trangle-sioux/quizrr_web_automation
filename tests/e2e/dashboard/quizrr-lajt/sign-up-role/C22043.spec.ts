import { test } from '../../../../../fixtures/dashboard.fixture';
import { SignUpEnterEmailPage } from '../../../../../pages/dashboard/sign-up';
import { EmailChecking } from '../../../../../utils';
import { generateOrganizationName } from '../../../../../utils/common.util';
import { environment as ENV } from '../../../../../utils/environment.util';
import { gmailUtil } from '../../../../../utils/gmail/gmail.util';

test.describe('[Sign up] Role', () => {
  let ownerEmailAddress: string;
  let userEmailAdress: string;
  let adminEmailAdress: string;
  let organizationNameInput: string;

  test.beforeEach('generate new email address', async ({}, testInfo) => {
    // Generate a organization name
    ownerEmailAddress = gmailUtil.generateNewEmailAddressForEachProject(
      ENV.TESTING_EMAIL_ADDRESS_1,
      'owner',
      testInfo.project.name,
    );
    userEmailAdress = gmailUtil.generateNewEmailAddressForEachProject(
      ENV.TESTING_EMAIL_ADDRESS_1,
      'user',
      testInfo.project.name,
    );
    adminEmailAdress = gmailUtil.generateNewEmailAddressForEachProject(
      ENV.TESTING_EMAIL_ADDRESS_1,
      'admin',
      testInfo.project.name,
    );
    organizationNameInput = generateOrganizationName(testInfo.project.name);
  });

  test('@C22043: Sign up an owner account @Critical', async ({
    context,
    browser,
    signUpEnterEmailPage,
    signUpEnterOtpPage,
    signUpCreateFacilityPage,
    signUpInviteMembersPage,
    signInEnterEmailPage,
    factoryPage: facilityPage,
  }) => {
    test.setTimeout(300000);
    await signUpEnterEmailPage.goToThePageWithTheSignUpToken(
      ENV.SIGN_UP_TOKEN_OWNER_ACC_1,
    );

    // Click on Privacy Policy link and then verify the Privacy Policy page is displayed
    const privacyPolicyPage =
      await signUpEnterEmailPage.naviagteToPrivacyPolicyPage(context);
    await privacyPolicyPage.verifyThePrivacyPolicyPageIsDisplayed();
    await privacyPolicyPage.close();

    // Click on Terms And Conditions link and then verify the Terms And Conditions Of Use page is displayed
    const termsAndConditionsPage =
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
    await signUpEnterEmailPage.signUpWithValidEmailAccount(ownerEmailAddress);
    await signUpEnterOtpPage.verifyTheVerificationPageShouldBeDisplayed();
    await EmailChecking.verifyAnOtpCodeShouldBeSentToEmail(ownerEmailAddress);

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
    await signUpEnterOtpPage.enterOtpCodeOfEmail(ownerEmailAddress);
    await signUpEnterOtpPage.verifySignUpButtonShouldBeEnabled();
    await signUpEnterOtpPage.clickOnSignUpBtn();
    await signUpCreateFacilityPage.verifyTheCreateFacilityPageShouldBeDisplayed();

    // Verify the market field is required with * icon is displayed
    await signUpCreateFacilityPage.verifyTheTheMarketFieldShouldHaveRequiredIcon();

    // Click on market and then vefify that the list market displayed correctly
    await signUpCreateFacilityPage.clickOnTheMarketField();
    await signUpCreateFacilityPage.verifyTheMarketsListShouldBeDisplayedCorrectly();

    // Select any market without region and then verify the selected market is displayed correctly
    await signUpCreateFacilityPage.selectTheMarketWithoutRegion();
    await signUpCreateFacilityPage.verifyTheSelectedMarketValueShouldBeDisplayed();

    // Select any market with region and then verify the region field is displayed
    await signUpCreateFacilityPage.clickOnTheMarketField();
    await signUpCreateFacilityPage.selectTheMarketWithRegion();
    await signUpCreateFacilityPage.verifyTheSelectedMarketValueShouldBeDisplayed();
    await signUpCreateFacilityPage.verifyTheRegionFieldShouldBeDisplayed();

    // Click on the region field and verify the list region is displayed correctly
    await signUpCreateFacilityPage.clickOnTheRegionField();
    await signUpCreateFacilityPage.verifyTheRegionsListShouldBeDisplayedCorrectly();

    // Select any region and verify the selected region is displayed correctly
    await signUpCreateFacilityPage.selectARegionOfSelectedMarket();
    await signUpCreateFacilityPage.verifyTheSelectedRegionValueShouldBeDisplayed();

    // Click on Number of Field and then verify the the list number of employees is displayed correctly
    await signUpCreateFacilityPage.clickOnTheNumberOfEmployeesField();
    await signUpCreateFacilityPage.verifyTheNumberOfEmployeesListShouldBeDisplayedCorrectly();

    // Select any number of employees and then verify that the selected number employees is displayed correctly
    await signUpCreateFacilityPage.selectAnyNumberOfEmployees();
    await signUpCreateFacilityPage.verifyTheSelectedNumberOfEmployeesShouldBeDisplayed();

    // Enter name of organization
    await signUpCreateFacilityPage.enterYourOrganizationName(
      organizationNameInput,
    );

    // Click on Continue button and then verify it redirects to Invite Members page
    await signUpCreateFacilityPage.clickOnContinueButton();
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

    // Enter admin user to invite colleagues email field
    await signUpInviteMembersPage.enterEmailInTheInviteColleaguesByEmailField(
      adminEmailAdress,
    );
    // Select can admin option
    await signUpInviteMembersPage.selectCanAdminOptionInTheInviteColleaguesByEmail();

    // Click on send invite button and then verify the the training invite email is sent to admin email
    await signUpInviteMembersPage.clickOnSendInvitesButton();
    await EmailChecking.verifyTheTrainingInviteShouldBeSentToEmail(
      adminEmailAdress,
    );

    // Click on Invite link button and then verify the link copied text is displayed
    await signUpInviteMembersPage.clickOnCopyInviteLinkButtonInTheInviteColleaguesByLink();
    await signUpInviteMembersPage.verifyTheLinkCopiedTextShouldBeDisplayedOnInviteLinkButton();

    // Open incognito browser and the vereify the sign in player page is displayed
    const newPlayerContext =
      await signUpInviteMembersPage.openNewIncognitoAndGoWithTheLinkCopied(
        browser,
      );
    signUpEnterEmailPage = new SignUpEnterEmailPage(newPlayerContext);
    await signUpEnterEmailPage.verifyTheSignUpPlayerPageShouldBeDisplayed();
    signUpEnterEmailPage.close();

    // Select can admin option of invite by link
    await signUpInviteMembersPage.selectCanAdminOptionInTheInviteColleaguesByLink();

    // Click on Invite link button and then verify the link copied text is displayed
    await signUpInviteMembersPage.clickOnCopyInviteLinkButtonInTheInviteColleaguesByLink();
    await signUpInviteMembersPage.verifyTheLinkCopiedTextShouldBeDisplayedOnInviteLinkButton();

    // Open incognito browser and the verify the sign in admin page is displayed
    const newAdminContext =
      await signUpInviteMembersPage.openNewIncognitoAndGoWithTheLinkCopied(
        browser,
      );
    signUpEnterEmailPage = new SignUpEnterEmailPage(newAdminContext);
    await signUpEnterEmailPage.verifyTheSignUpAdminPageShouldBeDisplayed();
    signUpEnterEmailPage.close();

    // Click on Continue button and then verify the Dashboard page is displayed
    await signUpInviteMembersPage.clickOnContinueButton();
    await facilityPage.verifyTheFactoryPageShouldBeDisplayed();
  });
});
