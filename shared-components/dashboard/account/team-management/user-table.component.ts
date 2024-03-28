import { expect, Locator, Page } from '@playwright/test';
import * as util from 'util';
import { Icons } from '../../../../enums/icon.enum';
import { TeamManagementColumns } from '../../../../enums/team-management.enum';
import {
  getTeamManagementStatus,
  getTeamManagementWithKeys,
} from '../../../../locales/dashboard/get-content';

export class UserTableComponent {
  private readonly colleagueColTxt: string = getTeamManagementWithKeys(
    TeamManagementColumns.COLLEAGUES,
  );
  private readonly stausColTxt: string = getTeamManagementStatus(
    TeamManagementColumns.STATUS_TITLE,
  );
  private readonly completedModulesColTxt: string = getTeamManagementWithKeys(
    TeamManagementColumns.COMPLETED_MODULE,
  );
  private readonly permissionsColTxt: string = getTeamManagementWithKeys(
    TeamManagementColumns.PERMISSIONS,
  );
  private readonly subTeamColTxt: string = getTeamManagementWithKeys(
    TeamManagementColumns.SUB_TEAM,
  );
  private readonly cellOfRowByColumnIndexStr =
    'table tbody tr:nth-child(%s) td:nth-child(%s)';

  private readonly iconCellOfRowByColumnIndexStr =
    this.cellOfRowByColumnIndexStr + ` button svg[data-icon='%s']`;

  private readonly headerTxt: Locator;
  private readonly rows: Locator;
  private readonly rowIndexesByCell: (index: string) => Locator;
  private readonly cellOfRowsByColumnIndex: (
    rowIdx: string,
    colIdx: string,
  ) => Locator;
  private readonly iconCellOfRowByColIdx: (
    rowIdx: string,
    colIdx: string,
    iconName: string,
  ) => Locator;
  private readonly rowByColleague: (name: string) => Locator;

  constructor(public readonly page: Page) {
    this.headerTxt = this.page.locator('table th p');

    this.rowIndexesByCell = (index: string) =>
      this.page.locator(`table tbody td:nth-child(${index})`);
    this.rows = this.page.locator('table tbody tr');
    this.cellOfRowsByColumnIndex = (rowIdx: string, colIdx: string) =>
      this.page.locator(
        util.format(this.cellOfRowByColumnIndexStr, rowIdx, colIdx),
      );
    this.iconCellOfRowByColIdx = (
      rowIdx: string,
      colIdx: string,
      iconName: string,
    ) =>
      this.page.locator(
        util.format(
          this.iconCellOfRowByColumnIndexStr,
          rowIdx,
          colIdx,
          iconName,
        ),
      );
    this.rowByColleague = (name: string) =>
      this.page.locator(
        util.format(
          `xpath=//td[.='%s']/ancestor::tr[contains(@class, 'TeamRow')]`,
          name,
        ),
      );
  }

  // ========================= ACTION ========================
  private async getTotalRows() {
    return await this.rows.count();
  }

  private async getColumnIndex(columName: string): Promise<number> {
    const headers = await this.headerTxt.allInnerTexts();
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] == columName) {
        return i + 1;
      }
    }
    throw Error(`Can not find column name: ${columName}`);
  }

  private async getRowsIndexByUniqueText(
    columnName: string,
    anchorValue: string,
  ) {
    let rowIndexes: number[] = [];
    const columnIdx: number = await this.getColumnIndex(columnName);
    const totalRows: number = await this.getTotalRows();
    for (let i = 1; i <= totalRows; i++) {
      const locator: Locator = this.cellOfRowsByColumnIndex(
        i.toString(),
        columnIdx.toString(),
      ).filter({
        has: this.page.locator('p', { hasText: `${anchorValue}` }),
      });
      if (await locator.isVisible()) {
        rowIndexes.push(i);
      }
    }
    return rowIndexes;
  }

  private async getFirstRowIndexByUniqueText(
    columnName: string,
    anchorValue: string,
  ) {
    const rowIndexes: number[] = await this.getRowsIndexByUniqueText(
      columnName,
      anchorValue,
    );
    if (rowIndexes.length == 0) {
      throw new Error(
        `Can't find anchorValue: ${anchorValue} in column: ${columnName}`,
      );
    }
    return rowIndexes[0];
  }

  private async getCellLocator(columName: string, rowIndex: number) {
    const columnIdx: number = await this.getColumnIndex(columName);
    return this.cellOfRowsByColumnIndex(
      rowIndex.toString(),
      columnIdx.toString(),
    );
  }

  private async getCellInnerText(columName: string, rowIndex: number) {
    const cellLocator: Locator = await this.getCellLocator(columName, rowIndex);
    return await cellLocator.locator('p').innerText();
  }

  private async getAllCellsInnerText(columName: string) {
    const columnIdx: number = await this.getColumnIndex(columName);
    return await this.rowIndexesByCell(columnIdx.toString())
      .locator('p')
      .allInnerTexts();
  }

  async getAllColleagues() {
    return await this.getAllCellsInnerText(this.colleagueColTxt);
  }

  async getUserColleagues(user: string) {
    const rowIdx = await this.getFirstRowIndexByUniqueText(
      this.colleagueColTxt,
      user,
    );
    return await this.getCellInnerText(this.colleagueColTxt, rowIdx);
  }

  async getUserStatus(user: string) {
    const rowIdx = await this.getFirstRowIndexByUniqueText(
      this.colleagueColTxt,
      user,
    );
    return await this.getCellInnerText(this.stausColTxt, rowIdx);
  }

  async getUserCompletedModule(user: string) {
    const rowIdx = await this.getFirstRowIndexByUniqueText(
      this.colleagueColTxt,
      user,
    );
    return await this.getCellInnerText(this.completedModulesColTxt, rowIdx);
  }

  async getUserPermissions(user: string) {
    const rowIdx = await this.getFirstRowIndexByUniqueText(
      this.colleagueColTxt,
      user,
    );
    return await this.getCellInnerText(this.permissionsColTxt, rowIdx);
  }

  async getUserSubTeamName(user: string) {
    const rowIdx = await this.getFirstRowIndexByUniqueText(
      this.colleagueColTxt,
      user,
    );
    return await this.getCellInnerText(this.subTeamColTxt, rowIdx);
  }

  async getUserAdminTeamMember(user: string) {
    const rowIdx = await this.getFirstRowIndexByUniqueText(
      this.colleagueColTxt,
      user,
    );
    return await this.getCellInnerText('#', rowIdx);
  }

  private async clickOnIconOfTheUser(user: string, iconName: string) {
    const colIdx = await this.getColumnIndex('');
    const rowIdx = await this.getFirstRowIndexByUniqueText(
      this.colleagueColTxt,
      user,
    );
    await this.iconCellOfRowByColIdx(
      rowIdx.toString(),
      colIdx.toString(),
      iconName,
    ).click();
  }

  async clickOnPlusIconOfTheUser(user: string) {
    await this.clickOnIconOfTheUser(user, Icons.PLUS);
  }

  async clickOnMinusIconOfTheUser(user: string) {
    await this.clickOnIconOfTheUser(user, Icons.MINUS);
  }

  // ========================= VERIFY ========================
  private async verifyIconOfTheUserShouldBeDisplayed(
    user: string,
    iconName: string,
  ) {
    const colIdx = await this.getColumnIndex('');
    const rowIdx = await this.getFirstRowIndexByUniqueText(
      this.colleagueColTxt,
      user,
    );
    expect(
      this.iconCellOfRowByColIdx(
        rowIdx.toString(),
        colIdx.toString(),
        iconName,
      ),
      `Verify the '${iconName}' icon visibility of '${user}'`,
    ).toBeVisible();
  }

  async verifyTheEnvelopeIconOfTheUserShouldBeDisplayed(user: string) {
    await this.verifyIconOfTheUserShouldBeDisplayed(user, Icons.ENVELOPE);
  }

  async verifyTheTimesCircleIconOfTheUserShouldBeDisplayed(user: string) {
    await this.verifyIconOfTheUserShouldBeDisplayed(user, Icons.TIMES_CIRCLE);
  }

  async verifyThePlusIconOfTheUserShouldBeDisplayed(user: string) {
    await this.verifyIconOfTheUserShouldBeDisplayed(user, Icons.PLUS);
  }

  async verifyTheMinusIconOfTheUserShouldBeDisplayed(user: string) {
    await this.verifyIconOfTheUserShouldBeDisplayed(user, Icons.MINUS);
  }

  async verifyTheUserIsHidden(user: string) {
    await this.rowByColleague(user).isHidden();
  }
}
