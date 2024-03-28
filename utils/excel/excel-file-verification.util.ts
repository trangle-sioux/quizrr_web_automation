import { expect } from '@playwright/test';
import { FilePathKey } from '../../enums';
import { TrainingReportColumn } from '../../enums/training-report-column.enum';
import {
  calculateLearningModulesDataOfUserFromTrainindModuleByGenerateIdInSessionV2,
  getAllUsersTrainingEmailAddressBelongingToTheOwnerEmail,
  getPlayerGeneratedIdByEmail,
} from '../../tests/data';
import {
  getAllLearningModuleKeysInMapByEmail,
  getAllLearningModuleNamesInListByEmail,
} from '../../tests/data/training-content/training-content.data';
import { getCache } from '../cache.util';
import { sortArrayObjectBySpecificKey } from '../common.util';
import { readFirstSheetNameOfXlsxFile } from './excel-file.util';

export class ExcelFileVerification {
  // ======== Check XLSL file ========

  static verifyTheExcelFileShouldBeEmptyData() {
    const excelPath: string = getCache<string>(
      FilePathKey.REPORT_DOWNLOADED_FILE_PATH,
    );
    const excelData = readFirstSheetNameOfXlsxFile(excelPath);
    expect(excelData).toHaveLength(0);
  }

  static async verifyTheUserExcelDataShouldBeDisplayCorrectly(user: string) {
    const excelPath: string = getCache<string>(
      FilePathKey.REPORT_DOWNLOADED_FILE_PATH,
    );
    const excelData = readFirstSheetNameOfXlsxFile(excelPath);
    const emailLst =
      getAllUsersTrainingEmailAddressBelongingToTheOwnerEmail(user);
    const moduleKeysInTrainingContent =
      getAllLearningModuleKeysInMapByEmail(user);
    let sessionV2Data = [];
    for (const email of emailLst) {
      const generatedId = getPlayerGeneratedIdByEmail(email);
      sessionV2Data.push(
        calculateLearningModulesDataOfUserFromTrainindModuleByGenerateIdInSessionV2(
          generatedId,
          moduleKeysInTrainingContent,
        ),
      );
    }
    const sortedExcelData = sortArrayObjectBySpecificKey(
      excelData,
      TrainingReportColumn.EMPLOYEE_ID,
    );
    const sortedSessionV2Date = sortArrayObjectBySpecificKey(
      sessionV2Data,
      TrainingReportColumn.EMPLOYEE_ID,
    );
    expect(sortedExcelData.length).toEqual(sortedSessionV2Date.length);
    const moduleNames = getAllLearningModuleNamesInListByEmail(user);
    sortedExcelData.every((item, index) => {
      expect
        .soft(
          item[TrainingReportColumn.NUMBER_OF_COMPLETED_MODULE],
          'Verify number of completed modules',
        )
        .toEqual(
          sortedSessionV2Date[index][
            TrainingReportColumn.NUMBER_OF_COMPLETED_MODULE
          ],
        );
      expect
        .soft(item[TrainingReportColumn.EMPLOYEE_ID], 'Verify Employee Id')
        .toEqual(sortedSessionV2Date[index][TrainingReportColumn.EMPLOYEE_ID]);
      for (const moduleName of moduleNames) {
        expect
          .soft(
            item[moduleName],
            `Verify ${moduleName} learning module of ${
              item[TrainingReportColumn.EMPLOYEE_ID]
            }`,
          )
          .toEqual(sortedSessionV2Date[index][moduleName]);
      }
      // Handle the bug: QTD-4606
      // Skipp check status of the 2 employee ids
      // Remove this condition as soon as the bug has been fixed
      if (
        item[TrainingReportColumn.EMPLOYEE_ID] !== '4PL4-19016' &&
        item[TrainingReportColumn.EMPLOYEE_ID] !== 'P4-A1-19016'
      ) {
        expect
          .soft(
            item[TrainingReportColumn.STATUS],
            `Verify Status of ${item[TrainingReportColumn.EMPLOYEE_ID]}`,
          )
          .toEqual(sortedSessionV2Date[index][TrainingReportColumn.STATUS]);
      }
    });
  }
}
