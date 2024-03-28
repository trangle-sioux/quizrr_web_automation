import { test as base } from '@playwright/test';
import { getRandomMarketNameWithoutRegion } from '../../tests/data';
import { AccountRole, HomeCountryOption } from '../../enums';
import { gmailUtil, environment as ENV, cacheAccessedToken } from '../../utils';
import {
  SignUpCreateFacilityPage,
  SignUpEnterEmailPage,
  SignUpEnterOtpPage,
  SignUpInviteMemebersPage,
} from '../../pages/dashboard/sign-up';
import { OverviewPage } from '../../pages/dashboard/app/overview';

type PreSignUpFixtures = {
  theUserSignedUpByOwnerAccount: OverviewPage;
  theUserSignedUpTo4ModulesTrainingByOwnerAccount: OverviewPage;
};

export const signUpTest = base.extend<PreSignUpFixtures>({
  theUserSignedUpByOwnerAccount: async ({ page }, use, testInfo) => {
    const newOwnerEmail = gmailUtil.generateNewEmailAddressForEachProject(
      ENV.TESTING_EMAIL_ADDRESS_1,
      AccountRole.OWNER,
      testInfo.project.name,
    );
    const enterEmailPage = new SignUpEnterEmailPage(page);
    enterEmailPage.clearCookies();
    enterEmailPage.clearPermissions();
    await enterEmailPage.bypassEnterEmailPageByEmailAddress(newOwnerEmail);
    const enterOtpPage = new SignUpEnterOtpPage(page);
    await enterOtpPage.submitCorrectOtpCodeFromEmail(newOwnerEmail);
    const createFactoryPage = new SignUpCreateFacilityPage(page);
    const market: string = getRandomMarketNameWithoutRegion();
    await createFactoryPage.setUpOrganizationAs(
      'test organization name',
      market,
      '11 - 50',
    );
    const inviteMembersPage = new SignUpInviteMemebersPage(page);
    await inviteMembersPage.clickOnContinueButton();
    await page.waitForLoadState();
    await use(new OverviewPage(page));
  },

  theUserSignedUpTo4ModulesTrainingByOwnerAccount: async (
    { page },
    use,
    testInfo,
  ) => {
    const newOwnerEmail = gmailUtil.generateNewEmailAddressForEachProject(
      ENV.TESTING_EMAIL_ADDRESS_1,
      AccountRole.OWNER,
      testInfo.project.name,
    );
    const enterEmailPage = new SignUpEnterEmailPage(page);
    await enterEmailPage.goToThePageWithTheSignUpToken(
      ENV.SIGN_UP_TOKEN_OWNER_ACC_1,
    );
    await enterEmailPage.signUpWithValidEmailAccount(newOwnerEmail);
    const enterOtpPage = new SignUpEnterOtpPage(page);
    await enterOtpPage.submitCorrectOtpCodeFromEmail(newOwnerEmail);
    const createFactoryPage = new SignUpCreateFacilityPage(page);
    const market: string = HomeCountryOption.VIETNAM.text;
    await createFactoryPage.setUpOrganizationAs(
      'test organization name',
      market,
      '11 - 50',
    );
    const inviteMembersPage = new SignUpInviteMemebersPage(page);
    await inviteMembersPage.clickOnContinueButton();
    await page.waitForLoadState();
    await use(new OverviewPage(page));
  },
});

export { expect } from '@playwright/test';
