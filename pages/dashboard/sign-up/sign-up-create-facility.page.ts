import { expect, Locator, Page } from '@playwright/test';
import { FacilityInfoKey, getHomeCountryOptionText } from '../../../enums';
import {
  getCreateFacilityTeamTitle,
  getFinishTitle,
} from '../../../locales/dashboard/get-content';
import { TeamSizeSelectionComponent } from '../../../shared-components/dashboard';
import {
  getListNameOfMarkets,
  getRandomMarketNameWithoutRegion,
  getRandomeMarketNameWithRegion,
  getRegionsOfMarket,
  getRandomRegionOfMarket,
} from '../../../tests/data';
import { getCache, getRandomItemInList, setCache } from '../../../utils';
import { BasePage } from '../../base.page';

export class SignUpCreateFacilityPage extends BasePage {
  private readonly titleTxt: Locator;
  private readonly organizationNameInputField: Locator;
  private readonly marketLbl: Locator;
  private readonly marketSelection: Locator;
  private readonly marketOptions: Locator;
  private readonly selectedMarketTxt: Locator;
  private readonly regionSelection: Locator;
  private readonly regionsOptions: Locator;
  private readonly selectedRegionTxt: Locator;
  private readonly continueBtn: Locator;

  private readonly teamSizeSelectionCpt: TeamSizeSelectionComponent;

  constructor(page: Page) {
    super(page);
    this.titleTxt = this.page.getByTestId('createFacilityForm-title');
    this.organizationNameInputField = this.page.getByTestId('teamName');
    this.marketLbl = this.page.getByTestId('createFacilityForm-marketLabel');
    this.marketSelection = this.page.getByTestId('market');
    this.marketOptions = this.page.locator('div#market div[class*="option"]');
    this.selectedMarketTxt = this.page.locator(
      'div#market div[class*="singleValue"]',
    );
    this.regionSelection = this.page.getByTestId('region');
    this.regionsOptions = this.page.locator('div#region div[class*="option"]');
    this.selectedRegionTxt = this.page.locator(
      'div#region div[class*="singleValue"]',
    );
    this.continueBtn = this.page.getByTestId('createFacilityForm-submitButton');
    this.teamSizeSelectionCpt = new TeamSizeSelectionComponent(page);
  }

  async clickOnTheMarketField() {
    await this.marketSelection.click();
  }

  async clickOnTheRegionField() {
    await this.regionSelection.click();
  }

  async selectTheMarket(market: string) {
    setCache(FacilityInfoKey.SELECT_MARKET, market);
    await this.marketOptions.filter({ hasText: market }).click();
  }

  async selectTheMarketWithoutRegion() {
    const market: string = getRandomMarketNameWithoutRegion();
    await this.selectTheMarket(market);
  }

  async selectTheMarketWithRegion() {
    const market: string = getRandomeMarketNameWithRegion();
    await this.selectTheMarket(market);
  }

  async selectTheRegion(region: string) {
    setCache(FacilityInfoKey.SELECT_REGION, region);
    await this.regionsOptions.filter({ hasText: region }).first().click();
  }

  async selectARegionOfSelectedMarket() {
    const selectedMarket = getCache<string>(FacilityInfoKey.SELECT_MARKET);
    const region: string = getRandomRegionOfMarket(selectedMarket);
    await this.selectTheRegion(region);
  }

  async clickOnTheNumberOfEmployeesField() {
    await this.teamSizeSelectionCpt.clickOnTheTeamSizeField();
  }

  async selectNumberOfEmployees(numberEmployees: string) {
    setCache(FacilityInfoKey.SELECT_NUMBER_OF_EMPLOYEES, numberEmployees);
    await this.teamSizeSelectionCpt.selectTeamSize(numberEmployees);
  }

  async selectAnyNumberOfEmployees() {
    await this.teamSizeSelectionCpt.selectAnyTeamSize();
    const selectedTeamSize = await this.teamSizeSelectionCpt.getTeamSizeValue();
    setCache(FacilityInfoKey.SELECT_NUMBER_OF_EMPLOYEES, selectedTeamSize);
  }

  async enterYourOrganizationName(teamName: string) {
    setCache(FacilityInfoKey.ENTER_ORGANIZATION_NAME, teamName);
    await this.organizationNameInputField.fill(teamName);
  }

  async clickOnContinueButton() {
    await this.continueBtn.click();
  }

  async setUpOrganizationAs(
    organizatonName: string,
    market: string,
    numberOfEmployees: string,
  ) {
    await this.enterYourOrganizationName(organizatonName);
    await this.clickOnTheMarketField();
    await this.selectTheMarket(market);
    const regions = getRegionsOfMarket(market);
    if (regions.length > 0) {
      await this.clickOnTheRegionField();
      await this.selectARegionOfSelectedMarket();
    }
    await this.clickOnTheNumberOfEmployeesField();
    await this.selectNumberOfEmployees(numberOfEmployees);
    await this.clickOnContinueButton();
  }

  // ========================= VERIFY ========================
  async verifyTheCreateFacilityPageShouldBeDisplayed() {
    const title = await getCreateFacilityTeamTitle();
    await expect(this.titleTxt).toHaveText(title);
  }

  async verifyTheTheMarketFieldShouldHaveRequiredIcon() {
    const after = await this.marketLbl.evaluate(e => {
      const style = window.getComputedStyle(e, '::after');
      return style.content;
    });
    expect(after).toEqual(expect.stringContaining(' *'));
  }

  async verifyTheMarketsListShouldBeDisplayedCorrectly() {
    const expectedMarkets = getListNameOfMarkets();
    expectedMarkets.sort((a: any, b: any) => a.localeCompare(b));
    await expect(this.marketOptions).toHaveText(expectedMarkets);
  }

  async verifyTheSelectedMarketValueShouldBeDisplayed() {
    const selectedMarket = getCache<string>(FacilityInfoKey.SELECT_MARKET);
    await expect(this.selectedMarketTxt).toHaveText(selectedMarket);
  }

  async verifyTheRegionFieldShouldBeDisplayed() {
    await expect(this.regionSelection).toBeVisible();
  }

  async verifyTheRegionsListShouldBeDisplayedCorrectly() {
    const selectedMarket = getCache<string>(FacilityInfoKey.SELECT_MARKET);
    const regions: string[] = getRegionsOfMarket(selectedMarket);
    await expect(this.regionsOptions).toHaveText(regions);
  }

  async verifyTheSelectedRegionValueShouldBeDisplayed() {
    const selectedRegion = getCache<string>(FacilityInfoKey.SELECT_REGION);
    await expect(this.selectedRegionTxt).toHaveText(selectedRegion);
  }

  async verifyTheNumberOfEmployeesListShouldBeDisplayedCorrectly() {
    await this.teamSizeSelectionCpt.verifyTheTeamSizeListShouldBeDisplayedCorrectly();
  }

  async verifyTheSelectedNumberOfEmployeesShouldBeDisplayed() {
    const selectedNumberOfEmp = getCache<string>(
      FacilityInfoKey.SELECT_NUMBER_OF_EMPLOYEES,
    );
    await this.teamSizeSelectionCpt.verifyTheTeamSizeValueShouldBeDisplayed(
      selectedNumberOfEmp,
    );
  }
}
