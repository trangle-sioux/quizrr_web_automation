import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';
import {
  Day,
  HomeCountryOption,
  Month,
  ProfileElement,
  VirtualCharacterKey,
  getGenderOptionTestIdByText,
  getHomeCountryOptionTestIdByText,
  getJobTypeOptionTestIdByText,
} from '../../../enums';
import { DynamicConfig } from '../../../dynamic-config/get-config.dynamic-config';
import {
  cacheSelectedJobs,
  generateRandomAPlayerIdNumber,
  getRandomItemInList,
  getAccessedTokenFromCache,
  switchCaseUndefined,
} from '../../../utils';
import { WAIT_IN_10_SECOND } from '../../../constants';

export class WebBasedInputProfilePage extends WebBasedTrainingBasePage {
  private readonly nextBtn: Locator;
  private readonly submitBtn: Locator;
  private readonly daySelection: Locator;
  private readonly monthSelection: Locator;
  private readonly yearSelection: Locator;
  private readonly selectHomeCountryInputField: Locator;
  private readonly isNumberInputField: Locator;
  private readonly closeVirtualKeyboardBtn: Locator;
  private readonly closeHomeCountryPopupBtn: Locator;
  private readonly genderTitleTxt: Locator;
  private readonly genderOpt: (genderTestId: string) => Locator;
  private readonly jobTypeOpt: (jobTypeTestId: string) => Locator;
  private readonly homeCountryOpt: (homeCountryTestId: string) => Locator;
  private readonly poppedUpHomeCountryOpt: (
    homeCountryTestId: string,
  ) => Locator;
  private readonly virtualCharacterKey: (key: string) => Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.nextBtn = this.webBasedTrainingFrame.getByTestId(
      'SpecContainer-PageLayout-nextButton',
    );
    this.submitBtn = this.webBasedTrainingFrame.getByTestId(
      'SpecContainer-FrameLayout-submitButton',
    );
    this.daySelection = this.webBasedTrainingFrame.getByTestId(
      'DatePicker-day-inputSelect',
    );
    this.monthSelection = this.webBasedTrainingFrame.getByTestId(
      'DatePicker-month-inputSelect',
    );
    this.yearSelection = this.webBasedTrainingFrame.getByTestId(
      'DatePicker-year-inputSelect',
    );
    this.selectHomeCountryInputField = this.webBasedTrainingFrame.getByTestId(
      'InputSelectViaSearchableList-country-input',
    );
    this.isNumberInputField = this.webBasedTrainingFrame.getByTestId(
      'InputIdVisualizer-idClean-maskedInput',
    );
    this.closeVirtualKeyboardBtn = this.webBasedTrainingFrame.getByTestId(
      'InputIdVisualizer-idClean-virtualKeyboard-closeButton',
    );
    this.closeHomeCountryPopupBtn = this.webBasedTrainingFrame.getByRole(
      'button',
      { name: 'Close' },
    );
    this.genderTitleTxt = this.webBasedTrainingFrame.getByTestId(
      'InputSelectVisualizer-gender-title',
    );
    this.genderOpt = (genderTestId: string) =>
      this.webBasedTrainingFrame.getByTestId(
        `InputSelectVisualizer-gender-${genderTestId}-radioInput`,
      );
    this.jobTypeOpt = (jobTypeTestId: string) =>
      this.webBasedTrainingFrame.getByTestId(
        `InputSelectVisualizer-jobLevel-${jobTypeTestId}-radioInput`,
      );
    this.homeCountryOpt = (countryTestId: string) =>
      this.webBasedTrainingFrame.getByTestId(`country-${countryTestId}`);
    this.poppedUpHomeCountryOpt = (countryTestId: string) =>
      this.webBasedTrainingFrame.getByTestId(
        `InputSelectViaSearchableList-country-${countryTestId}-radioInput`,
      );
    this.virtualCharacterKey = (key: string) =>
      this.webBasedTrainingFrame.locator(`[data-skbtn="${key}"]`);
  }

  // ========================= ACTIONS ========================

  /**
   *
   * @param gender : choose from GenderOption.<option>.text from : enums/web-based-training/player-profile.enum.ts
   */
  async chooseGenderAs(gender: string) {
    const genderOptTestId = getGenderOptionTestIdByText(gender);
    await expect(this.genderOpt(genderOptTestId)).toBeEnabled({
      timeout: WAIT_IN_10_SECOND,
    });
    await this.genderOpt(genderOptTestId).click();
  }

  async selectYearOfBirthAs(year: string) {
    await expect(this.yearSelection).toBeEnabled({
      timeout: WAIT_IN_10_SECOND,
    });
    await this.yearSelection.selectOption(year);
  }

  async selectDayOfBirthAs(day: string) {
    await this.daySelection.selectOption(day);
  }

  async selectMonthOfBirthAs(month: string) {
    await this.monthSelection.selectOption(month);
  }

  /**
   *
   * @param jobType : choose from JobTypeOption.<option>.text from : enums/web-based-training/player-profile.enum.ts
   */
  async chooseJobTypeAs(jobType: string) {
    const jobTypeOptTestId = getJobTypeOptionTestIdByText(jobType);
    await expect(this.jobTypeOpt(jobTypeOptTestId)).toBeEnabled({
      timeout: WAIT_IN_10_SECOND,
    });
    await this.jobTypeOpt(jobTypeOptTestId).click();
    cacheSelectedJobs(jobType);
  }

  async enterIdNumberAs(idNumber: string) {
    await this.isNumberInputField.click();
    const characters = idNumber.split('');
    for (const character of characters) {
      await this.clickOnVirtualCharacterKey(character);
    }
    await this.closeVirtualKeyboard();
  }

  async clickOnVirtualCharacterKey(character: string) {
    let characterId;
    switch (character) {
      case VirtualCharacterKey.SPACE:
        characterId = '{space}';
        break;
      case VirtualCharacterKey.DELETE:
        characterId = '{bksp}';
        break;
      default:
        characterId = character;
    }
    await this.virtualCharacterKey(characterId).click();
  }

  async closeVirtualKeyboard() {
    await this.closeVirtualKeyboardBtn.click();
  }

  /**
   * Use for choosing home country setting
   * @param homeCountry : home country option get from HomeCountryOption.<option>.text from : enums/web-based-training/player-profile.enum.ts
   */
  async chooseHomeCountryAs(homeCountry: string) {
    const homeCountryOptTestId = getHomeCountryOptionTestIdByText(homeCountry);
    // tap next btn if the home country is not visible before choosing the home country
    if (await this.homeCountryOpt(homeCountryOptTestId).isHidden()) {
      await this.clickOnNextButton();
    }
    await this.homeCountryOpt(homeCountryOptTestId).click();
  }

  /**
   * Use for selecting searchable home country setting
   * @param homeCountry : home country option get from HomeCountryOption.<option>.text from : enums/web-based-training/player-profile.enum.ts
   */
  async selectHomeCountryAs(homeCountry: string) {
    // tap next btn if the home country is not visible before choosing the home country
    if (await this.selectHomeCountryInputField.isHidden()) {
      await this.clickOnNextButton();
    }
    await this.selectHomeCountryInputField.click();
    await this.chooseOptionOnHomeCountryPopup(homeCountry);
  }

  async closeHomeCountryPopup() {
    await this.closeHomeCountryPopupBtn.click();
  }

  async clickOnNextButton() {
    await this.nextBtn.click();
  }
  async clickOnSubmitButton() {
    await this.submitBtn.click();
  }

  async submitAFilledProfile() {
    const token = getAccessedTokenFromCache();
    const profileElement = DynamicConfig.getProfileElementsByToken(token) ?? [];
    const genderOptions = DynamicConfig.getGenderOptionsByToken(token) ?? [];
    const jobTypeOptions = DynamicConfig.getJobTypeOptionsByToken(token) ?? [];
    const homeCountryOptions =
      DynamicConfig.getHomeCountryOptionsByToken(token) ?? [];
    for (const element of profileElement) {
      let randomValue;
      switch (element) {
        case ProfileElement.GENDER.toString():
          randomValue = getRandomItemInList(genderOptions);
          await this.chooseGenderAs(randomValue);
          break;
        case ProfileElement.JOB_TYPE.toString():
          randomValue = getRandomItemInList(jobTypeOptions);
          await this.chooseJobTypeAs(randomValue);
          break;
        case ProfileElement.YEAR_OF_BIRTH.toString():
          await this.selectYearOfBirthAs('1971');
          break;
        case ProfileElement.DATE_OF_BIRTH.toString():
          await this.selectDayOfBirthAs(Day.DAY_01);
          await this.selectMonthOfBirthAs(Month.DECEMBER);
          await this.selectYearOfBirthAs('1971');
          break;
        case ProfileElement.ID_NUMBER.toString():
          randomValue = generateRandomAPlayerIdNumber(10);
          await this.enterIdNumberAs(randomValue);
          break;
        case ProfileElement.HOME_COUNTRY.toString():
          if (homeCountryOptions.length > 0) {
            const randomCountry = getRandomItemInList(homeCountryOptions);
            await this.chooseHomeCountryAs(randomCountry);
          } else {
            await this.selectHomeCountryAs(HomeCountryOption.CHINA.text);
          }
          break;
        default:
          switchCaseUndefined(element);
      }
    }
    await this.clickOnSubmitButton();
  }
  // =========== ACTIONS ON: SELECT HOME COUNTRY POP-UP ===========

  /**
   * Use for selecting home country setting
   * @param homeCountry : home country option get from HomeCountryOption.<option>.text
   */
  async chooseOptionOnHomeCountryPopup(homeCountry: string) {
    const homeCountryOptTestId = getHomeCountryOptionTestIdByText(homeCountry);
    await this.poppedUpHomeCountryOpt(
      homeCountryOptTestId,
    ).scrollIntoViewIfNeeded();
    await this.poppedUpHomeCountryOpt(homeCountryOptTestId).click();
  }

  // ========================= VERIFY ========================

  async verifyTheNextButtonShouldBeDisplayed() {
    await expect(this.nextBtn).toBeVisible();
  }

  async verifyTheGenderLabelShouldBeHidden() {
    await expect(this.genderTitleTxt).toBeHidden();
  }

  async verifyTheInputProfilePageShouldBeHidden() {
    await this.verifyTheGenderLabelShouldBeHidden();
  }
}
