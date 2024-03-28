import { expect, Locator, Page } from '@playwright/test';
import { ListNumberOfEmployees } from '../../../tests/data';
import { getRandomItemInList } from '../../../utils';

export class TeamSizeSelectionComponent {
  private readonly numberOfEmployeesSelection: Locator;
  private readonly numberOfEmployeesOptions: Locator;
  private readonly numberOfEmployeesValueTxt: Locator;

  constructor(public readonly page: Page) {
    this.numberOfEmployeesSelection = this.page.getByTestId('teamSize');
    this.numberOfEmployeesOptions = this.page.locator(
      'div#teamSize div[class*="option"]',
    );
    this.numberOfEmployeesValueTxt = this.page.locator(
      'div#teamSize div[class*="singleValue"]',
    );
  }

  // ========================= ACTION ========================

  async clickOnTheTeamSizeField() {
    await this.numberOfEmployeesSelection.click();
  }

  async selectTeamSize(numberEmployees: string) {
    await this.numberOfEmployeesOptions
      .filter({ hasText: numberEmployees })
      .click();
  }

  async selectAnyTeamSize() {
    await this.selectAnyTeamSizeInList(ListNumberOfEmployees);
  }

  async selectAnyTeamSizeInList(listNumberOfEmployees: string[]) {
    const numberEmployees = getRandomItemInList(listNumberOfEmployees);
    await this.selectTeamSize(numberEmployees);
  }

  async selectAnyTeamSizeDiffrentFromTheCurrent(currentTeamValue: string) {
    const filterTeamSizeLst: string[] = ListNumberOfEmployees.filter(
      val => currentTeamValue !== val,
    );
    await this.selectAnyTeamSizeInList(filterTeamSizeLst);
  }

  async getTeamSizeValue() {
    return await this.numberOfEmployeesValueTxt.innerText();
  }

  // ========================= VERIFY ========================
  async verifyTheTeamSizeListShouldBeDisplayedCorrectly() {
    await expect(this.numberOfEmployeesOptions).toHaveText(
      ListNumberOfEmployees,
    );
  }

  async verifyTheTeamSizeValueShouldBeDisplayed(selectedValue: string) {
    await expect(this.numberOfEmployeesValueTxt).toHaveText(selectedValue);
  }
}
