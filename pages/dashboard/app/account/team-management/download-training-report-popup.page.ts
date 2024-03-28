import { expect, Locator, type Page } from '@playwright/test';
import { FilePathKey } from '../../../../../enums';
import {
  getTeamManagementInformationGetReport,
  getTeamManagementInformationSelectTime,
} from '../../../../../locales/dashboard/get-content';
import { DateRangePickerComponent } from '../../../../../shared-components/dashboard';
import { DashboardBasePage } from '../../../dashboard-base.page';
import { generateStoreDownloadedPathForEachProject } from '../../../../../utils/excel/excel-file.util';
import { setCache } from '../../../../../utils';

export class DownloadTrainingReportPopupPage extends DashboardBasePage {
  private readonly titleTxt: Locator;
  private readonly closeBtn: Locator;
  private readonly confirmBtn: Locator;

  private readonly dateRangePickerCpt: DateRangePickerComponent;

  constructor(public readonly page: Page) {
    super(page);
    this.titleTxt = this.page.getByTestId('DownloadReport-label');
    this.closeBtn = this.page.getByTestId('DownloadReport-closeButton');
    this.confirmBtn = this.page.getByTestId(
      'DownloadReportContent-confirmButton',
    );
    this.dateRangePickerCpt = new DateRangePickerComponent(page);
  }

  // ========================= ACTION ========================
  async clickOnClosePopUpButton() {
    await this.closeBtn.click();
  }

  async clickOnConfirmButton() {
    await this.confirmBtn.click();
  }

  async downloadTrainingReport(projectName: string) {
    await this.clickOnConfirmButton();
    const downloadedPath =
      generateStoreDownloadedPathForEachProject(projectName) + '/';
    const saveFilePath = await super.downloadAFile(downloadedPath);
    setCache(FilePathKey.REPORT_DOWNLOADED_FILE_PATH, saveFilePath);
  }

  async selectTimePeriodFromDateToDate(fromDate: string, toDate: string) {
    await this.dateRangePickerCpt.selectTimePeriod(fromDate, toDate);
  }

  // ========================= VERIFY ========================
  async verifyTheDownloadTraingReportPopupShouldBeDisplayedCorrectly() {
    await expect(this.titleTxt).toHaveText(
      getTeamManagementInformationGetReport(),
    );
    await expect(this.closeBtn).toBeVisible();
    await expect(this.confirmBtn).toBeVisible();
    await this.verifyTheDateTimePickerShouldBeDisplayed();
  }

  async verifyTheDateTimePickerShouldBeDisplayed() {
    await this.dateRangePickerCpt.verifyTheStartDateInputFieldShouldBeDisplayed();
    await this.dateRangePickerCpt.verifyTheEndDateInputFieldShouldBeDisplayed();
  }

  async verifyTheDownloadTraingReportPopupShouldBeClosed() {
    await expect(this.titleTxt).toBeHidden();
  }
}
