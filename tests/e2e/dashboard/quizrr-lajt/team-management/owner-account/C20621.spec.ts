import { UserDataType, UserRole } from '../../../../../../enums';
import { test } from '../../../../../../fixtures/dashboard.fixture';
import { ExcelFileVerification } from '../../../../../../utils/excel/excel-file-verification.util';
import {
  createDownloadedReportFolderForEachProject,
  removeAllDownloadedReportXlsxFilesForEachProject,
} from '../../../../../../utils/excel/excel-file.util';
import { assignEmailAddressFromExistingUsersToEachProject as assignExistingUserEmail } from '../../../../../data/user-info/users.data';

test.describe('Team Management: Owner Account', () => {
  let existingOwnerEmail: string;
  test.beforeAll(
    'Create and clean stored downloaded report xlsx files',
    async ({}, testInfo) => {
      const projectName = testInfo.project.name;
      createDownloadedReportFolderForEachProject(projectName);
      removeAllDownloadedReportXlsxFilesForEachProject(projectName);
    },
  );

  test.beforeEach(
    'Login with an owner account without Invite Supplier feature',
    async ({
      theUserLoggedInSuccessfullyWithStaticTypeExistingOwnerEmail:
        theUserLoggedInSuccessfully,
      factoryPage,
    }) => {
      existingOwnerEmail = assignExistingUserEmail(
        UserRole.ACCOUNT_OWNER,
        UserDataType.STATIC,
      );
      theUserLoggedInSuccessfully;
      await factoryPage.closeGuidelinePopup();
      await factoryPage.gotoTeamManagementPage();
    },
  );

  test('@C20621: [Without Invite Supplier] - Verify the team information without training data', async ({
    teamManagementPage,
    editOrganizationInfoPopupPage,
    downloadTrainingReportPopupPage,
  }, testInfo) => {
    test.slow();
    // Verify the team information matches the data that selected in signup create facility page
    await teamManagementPage.verifyTheTeamInfoShouldBeMatchedCreatedDataByUserEmail(
      existingOwnerEmail,
    );
    await teamManagementPage.storeNumberOfEmployeesValue();

    // Click on Edit button
    await teamManagementPage.clickOnEditTeamSizeIcon();

    // Verify the information of edit organization popup
    await editOrganizationInfoPopupPage.verifyTheTitlePopupShouldBeDisplayedCorrectly();
    await editOrganizationInfoPopupPage.verifyTheSaveButtonShouldBeDisabled();
    await editOrganizationInfoPopupPage.verifyTheNumberOfEmployeesShouldBeDisplayedTheCurrentTeamValue();

    // Click on Number of employees field and then verify the list number of eployees display correctly
    await editOrganizationInfoPopupPage.clickOnNumberOfEmployeesField();
    await editOrganizationInfoPopupPage.verifyTheNumberOfEmployeesListShouldBeDisplayedCorrectly();

    // Verify the number of employees values doesn't change if the user updates the value without save
    await editOrganizationInfoPopupPage.selectAnyNumberOfEmployeesValue();
    await editOrganizationInfoPopupPage.clickOnClosePopUpButton();
    await editOrganizationInfoPopupPage.verifyTheEditOrganizationInfoPopupShouldBeClosed();
    await teamManagementPage.verifyTheNumberOfEmployeesValueShouldNotBeChanged();

    // Verify Download training report popup dislays after clicking on Download training report button
    await teamManagementPage.clickOnDownloadTrainingReportButton();
    await downloadTrainingReportPopupPage.verifyTheDownloadTraingReportPopupShouldBeDisplayedCorrectly();

    // Verify the Excel Report data
    await downloadTrainingReportPopupPage.downloadTrainingReport(
      testInfo.project.name,
    );
    await downloadTrainingReportPopupPage.verifyTheDownloadTraingReportPopupShouldBeClosed();
    ExcelFileVerification.verifyTheExcelFileShouldBeEmptyData();
  });
});
