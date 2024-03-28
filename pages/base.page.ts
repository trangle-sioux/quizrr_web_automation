import { Page } from '@playwright/test';

export class BasePage {
  constructor(readonly page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState();
  }

  async gotoNewPage(newPage: any, url: string) {
    await newPage.goto(url);
    await newPage.waitForLoadState();
  }

  async goBack() {
    await this.page.goBack();
    await this.page.waitForLoadState();
  }

  async close() {
    await this.page.close();
  }

  async acceptWindowDialog() {
    this.page.on('dialog', dialog => dialog.accept());
  }

  async openNewIncognitoAndGoWithTheLinkCopied(
    browser: any,
    copiedLink: string,
  ) {
    const context = await browser.newContext();
    const newPage = await context.newPage();
    await newPage.waitForLoadState();
    await this.gotoNewPage(newPage, copiedLink);
    return newPage;
  }

  clearCookies() {
    this.page.context().clearCookies();
  }

  clearPermissions() {
    this.page.context().clearPermissions();
  }

  async downloadAFile(downloadPath: string) {
    const download = await this.page.waitForEvent('download');
    const saveFilePath = downloadPath + download.suggestedFilename();
    await download.saveAs(saveFilePath);
    return saveFilePath;
  }
}
