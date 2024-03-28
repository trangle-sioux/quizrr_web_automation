import { Locator, Page, expect } from '@playwright/test';
import { WebBasedTrainingBasePage } from './web-based-training-base.page';
import { Languages } from '../../../locales/languages.locale';
import { WAIT_IN_10_SECOND, WAIT_IN_20_SECOND } from '../../../constants';

export class WebBasedWelcomePage extends WebBasedTrainingBasePage {
  private readonly welcomeTitleTxt: Locator;
  private readonly welcomeStartBtn: Locator;
  private readonly toggleLanguageOpts: (
    languageAbbreviation: string,
  ) => Locator;

  private readonly displayedLanguageToggleOtps: string[] = [
    'አማርኛ (የተተረጎመ)',
    'عربي',
    'বাংলা',
    '中文',
    'Deutsch',
    'English',
    'Español',
    'Français',
    'हिंदी',
    'Bahasa Indonesia',
    'ខ្មែរ',
    'ಕನ್ನಡ',
    'ພາສາລາວ',
    'मराठी',
    'Bahasa Melayu',
  ];

  constructor(public readonly page: Page) {
    super(page);
    this.welcomeTitleTxt =
      this.webBasedTrainingFrame.getByTestId('Welcome-title');
    this.welcomeStartBtn = this.webBasedTrainingFrame.getByTestId(
      'Welcome-startButton',
    );
    this.toggleLanguageOpts = (languageAbbreviation: string) =>
      this.webBasedTrainingFrame.getByTestId(
        `LanguageSelectorFlat-localeButton-${languageAbbreviation}`,
      );
  }

  // ========================= ACTIONS ========================

  async clickOnStartButton() {
    await this.welcomeStartBtn.click({ force: true });
  }

  // ========================= VERIFY ========================

  async verifyTheToggleOptionsShouldBeDisplayed() {
    for (const languageOpt of this.displayedLanguageToggleOtps) {
      await this.verifyTheLanguageToggleOptionShouldBeDisplayedIn(languageOpt);
    }
  }

  async verifyTheLanguageToggleOptionShouldBeDisplayedIn(
    originalLanguage: string,
  ) {
    const abbreviationName =
      Languages.getLanguageAbbreviationOf(originalLanguage);
    await expect(this.toggleLanguageOpts(abbreviationName)).toBeVisible({
      timeout: WAIT_IN_10_SECOND,
    });
    await expect(this.toggleLanguageOpts(abbreviationName)).toBeEnabled({
      timeout: WAIT_IN_10_SECOND,
    });
    await expect(this.toggleLanguageOpts(abbreviationName)).toHaveText(
      originalLanguage,
    );
  }
  async verifyTheStartButtonShouldBeDisplayed() {
    await expect(this.welcomeStartBtn).toBeVisible({
      timeout: WAIT_IN_20_SECOND,
    });
  }

  async verifyTheWelcomePageShouldBeDisplayed() {
    await expect(this.welcomeTitleTxt).toBeVisible({
      timeout: WAIT_IN_10_SECOND,
    });
    await this.verifyTheStartButtonShouldBeDisplayed();
  }
}
