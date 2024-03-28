import { expect, Locator, Page } from '@playwright/test';
import { HYPHEN_SYMBOL, REGEX_MONTH_YEAR } from '../../constants';
import { doesStringMatchRegex, getMonthName } from '../../utils';

export class DateRangePickerComponent {
  private readonly startDateInputField: Locator;
  private readonly endDateInputField: Locator;
  private readonly editBtn: Locator;
  private readonly monthSelection: Locator;
  private readonly monthOpts: Locator;
  private readonly yearSelection: Locator;
  private readonly yearOpts: Locator;
  private readonly closeBtn: Locator;

  constructor(public readonly page: Page) {
    this.startDateInputField = this.page.getByTestId(
      'DateRangePicker-startDateInput',
    );
    this.endDateInputField = this.page.getByTestId(
      'DateRangePicker-endDateInput',
    );
    this.editBtn = this.page.getByTestId('DateRangePicker-editButton');
    this.monthSelection = this.page.locator('span.rdrMonthPicker');
    this.monthOpts = this.page.locator('span.rdrMonthPicker select');
    this.yearSelection = this.page.locator('span.rdrYearPicker');
    this.yearOpts = this.page.locator('span.rdrYearPicker select');
    this.closeBtn = this.page.getByTestId('DateRangePicker-closeButton');
  }

  // ========================= ACTION ========================

  async clickOnStartDateInputField() {
    await this.startDateInputField.click();
  }

  async clickOnEndDateInputField() {
    await this.endDateInputField.click();
  }

  async selectMonth(month: string) {
    await this.monthSelection.click();
    await this.monthOpts.selectOption({ label: month });
  }

  async selectYear(year: string) {
    await this.yearSelection.click();
    await this.yearOpts.selectOption({ label: year });
  }

  private async selectDate(dateStr: string, isStartDate: boolean) {
    let monthStr: string = '';
    let yearStr: string = '';
    if (doesStringMatchRegex(dateStr, REGEX_MONTH_YEAR)) {
      const fromDates = dateStr.split(HYPHEN_SYMBOL);
      monthStr = getMonthName(parseInt(fromDates[0], 10));
      yearStr = fromDates[1];
    }
    if (isStartDate) {
      await this.clickOnStartDateInputField();
    } else {
      await this.clickOnEndDateInputField();
    }
    await this.selectMonth(monthStr);
    await this.selectYear(yearStr);
  }

  async selectEndDate(endDate: string) {
    await this.selectDate(endDate, true);
  }

  async selectToDate(toDate: string) {
    await this.selectDate(toDate, false);
  }

  async selectTimePeriod(fromDate: string, toDate: string) {
    await this.selectEndDate(fromDate);
    await this.selectToDate(toDate);
  }

  // ========================= VERIFY ========================
  async verifyTheStartDateInputFieldShouldBeDisplayed() {
    await expect(this.startDateInputField).toBeVisible();
  }

  async verifyTheEndDateInputFieldShouldBeDisplayed() {
    await expect(this.endDateInputField).toBeVisible();
  }
}
