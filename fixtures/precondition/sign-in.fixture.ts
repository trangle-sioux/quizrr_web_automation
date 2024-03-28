import { test as base } from '@playwright/test';
import { UserDataType, UserRole } from '../../enums';
import { FactoryPage } from '../../pages/dashboard/app/factory/factory.page';

import {
  SignInEnterEmailPage,
  SignInEnterOtpPage,
} from '../../pages/dashboard/sign-in';
import { assignEmailAddressFromExistingUsersToEachProject as assignExistingEmail } from '../../tests/data';

type PreSignInFixtures = {
  theUserLoggedInSuccessfullyWithDynamicTypeExistingOwnerEmail: FactoryPage;
  theUserLoggedInSuccessfullyWithStaticTypeExistingOwnerEmail: FactoryPage;
};

export const signInTest = base.extend<PreSignInFixtures>({
  theUserLoggedInSuccessfullyWithDynamicTypeExistingOwnerEmail: async (
    { page },
    use,
  ) => {
    const existingOwnerEmail = assignExistingEmail(
      UserRole.ACCOUNT_OWNER,
      UserDataType.DYNAMIC,
    );
    const enterEmailPage = new SignInEnterEmailPage(page);
    const enterOtpPage = new SignInEnterOtpPage(page);
    await enterEmailPage.signInWithTheEmail(existingOwnerEmail);
    await enterOtpPage.submitAnOtpCodeFromEmail(existingOwnerEmail);
    await page.waitForLoadState();
    await use(new FactoryPage(page));
  },

  theUserLoggedInSuccessfullyWithStaticTypeExistingOwnerEmail: async (
    { page },
    use,
  ) => {
    const existingOwnerEmail = assignExistingEmail(
      UserRole.ACCOUNT_OWNER,
      UserDataType.STATIC,
    );
    const enterEmailPage = new SignInEnterEmailPage(page);
    const enterOtpPage = new SignInEnterOtpPage(page);
    await enterEmailPage.signInWithTheEmail(existingOwnerEmail);
    await enterOtpPage.submitAnOtpCodeFromEmail(existingOwnerEmail);
    await page.waitForLoadState();
    await use(new FactoryPage(page));
  },
});

export { expect } from '@playwright/test';
