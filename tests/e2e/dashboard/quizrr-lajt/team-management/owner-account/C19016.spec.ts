import { UserRole } from '../../../../../../enums';
import { test } from '../../../../../../fixtures/dashboard.fixture';
import { ExcelFileVerification } from '../../../../../../utils';
import {
  createDownloadedReportFolderForEachProject,
  removeAllDownloadedReportXlsxFilesForEachProject,
} from '../../../../../../utils/excel/excel-file.util';
import {
  assignEmailAddressFromExistingUsersToEachProject as assignExistingUserEmail,
  getRandomAdminEmailAddressThatHasSubTeamMembersBelongingToTheOwnerEmail,
} from '../../../../../data/user-info/users.data';

test.describe('Team Management: Owner Account', () => {
  let existingOwnerEmail: string;
  let adminEmailHasSubTeamBelongingToTheOwnerEmail: string;

  test.beforeAll(
    'Create and clean stored downloaded report xlsx files',
    async ({}, testInfo) => {
      const projectName = testInfo.project.name;
      createDownloadedReportFolderForEachProject(projectName);
      removeAllDownloadedReportXlsxFilesForEachProject(projectName);
    },
  );

  test.beforeEach(
    'Login with an owner account',
    async ({ signInEnterEmailPage, signInEnterOtpPage, factoryPage }) => {
      existingOwnerEmail = assignExistingUserEmail(
        UserRole.ACCOUNT_OWNER,
        'C19016',
      );
      adminEmailHasSubTeamBelongingToTheOwnerEmail =
        getRandomAdminEmailAddressThatHasSubTeamMembersBelongingToTheOwnerEmail(
          existingOwnerEmail,
        );
      await signInEnterEmailPage.signInWithTheEmail(existingOwnerEmail);
      await signInEnterOtpPage.submitAnOtpCodeFromEmail(existingOwnerEmail);
      await factoryPage.closeGuidelinePopup();
      await factoryPage.gotoTeamManagementPage();
      await factoryPage.declineCookies();
    },
  );

  test('@C19016: [Your colleagues] - Verify the member list information displays correctly', async ({
    teamManagementPage,
    inviteColleaguesPopupPage,
    downloadTrainingReportPopupPage,
  }, testInfo) => {
    test.slow();

    // Verify the Your colleagues table data display correctly
    await teamManagementPage.clickOnYourColleaguesTab();
    await teamManagementPage.verifyTheYourColleaguesTableNameShouldBeDisplayed();
    await teamManagementPage.verifyTheInviteColleaguesButtonShouldBeDisplayed();
    await teamManagementPage.verifyTheColleaguesColumnShouldShowMembersEmailsOfTheOwner(
      existingOwnerEmail,
    );
    await teamManagementPage.verifyTheStatusColumnShouldShowTheTrainingStatusOfTheMembersBelongingToTheOwner(
      existingOwnerEmail,
    );
    await teamManagementPage.verifyTheCompletedModulesColumnShouldShowTheCompletedTrainingModuleOfTheMembersBelongingToTheOwner(
      existingOwnerEmail,
    );
    await teamManagementPage.verifyThePermissionsColumnShouldShowTheRightsOfMembersBelongingToTheOwner(
      existingOwnerEmail,
    );
    await teamManagementPage.verifyTheSubTeamColumnShouldShowTheTeamNameOfMembersBelongingToTheOwner(
      existingOwnerEmail,
    );
    await teamManagementPage.verifyTheHashColumnShouldShowTheAdminTeamMembersBelongingToTheOwner(
      existingOwnerEmail,
    );
    await teamManagementPage.verifyTheEnvelopeAndTimesCircleIconsShouldDisplayWithInvitePendingUserBelongingToTheOwner(
      existingOwnerEmail,
    );
    await teamManagementPage.verifyTheEnvelopeIconShouldDisplayWithNotStartedUserBelongingToTheOwner(
      existingOwnerEmail,
    );
    await teamManagementPage.verifyThePlusIconShouldDisplayWithTheAdminAccountThatHasSubMembersBelongingToTheOwner(
      existingOwnerEmail,
    );

    // Verify the admin members
    await teamManagementPage.clickOnPlusIconOfTheAdminAccount(
      adminEmailHasSubTeamBelongingToTheOwnerEmail,
    );
    await teamManagementPage.verifyTheMinusIconShouldDisplayWithTheAdminAccount(
      adminEmailHasSubTeamBelongingToTheOwnerEmail,
    );
    await teamManagementPage.verifyTheListMembersDataOfTheAdminAccountBelongingToTheOwnerShouldDisplayCorrectly(
      existingOwnerEmail,
      adminEmailHasSubTeamBelongingToTheOwnerEmail,
    );
    await teamManagementPage.clickOnMinusIconOfTheAdminAccount(
      adminEmailHasSubTeamBelongingToTheOwnerEmail,
    );
    await teamManagementPage.verifyThePlusIconShouldDisplayWithTheAdminAccount(
      adminEmailHasSubTeamBelongingToTheOwnerEmail,
    );
    await teamManagementPage.verifyTheMemberListOfTheAdminAccountBelongingToTheOwnerShouldBeHidden(
      existingOwnerEmail,
      adminEmailHasSubTeamBelongingToTheOwnerEmail,
    );

    // Verify Invite colleague popup after clicking on Invite Colleagues button
    await teamManagementPage.clickOnInviteColleaguesButton();
    await inviteColleaguesPopupPage.verifyTheInviteColleaguesByLinkComponentShouldBeDisplayedCorrectly();
    await inviteColleaguesPopupPage.verifyTheInviteColleaguesByEmailComponentShouldBeDisplayedCorrectly();
    await inviteColleaguesPopupPage.verifyTheInviteColleaguesWhoDoNotUseEmailByLinkComponentShouldBeDisplayedCorrectly();
    await inviteColleaguesPopupPage.clickOnClosePopUpButton();

    // Verify downloadning training report
    await teamManagementPage.clickOnDownloadTrainingReportButton();
    await downloadTrainingReportPopupPage.verifyTheDownloadTraingReportPopupShouldBeDisplayedCorrectly();
    await downloadTrainingReportPopupPage.selectTimePeriodFromDateToDate(
      '01-2024',
      '02-2024',
    );
    await downloadTrainingReportPopupPage.downloadTrainingReport(
      testInfo.project.name,
    );
    ExcelFileVerification.verifyTheUserExcelDataShouldBeDisplayCorrectly(
      existingOwnerEmail,
    );
  });
});
