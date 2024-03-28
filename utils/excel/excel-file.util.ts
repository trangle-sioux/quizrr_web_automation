import { STORE_DOWNLOADED_REPORTS_PATH } from '../../constants';
import { getIndexProjectByValue } from '../../enums';
import { environment as ENV } from '../environment.util';
import * as util from 'util';
import { resolve } from 'path';
import {
  createFolderIfNotExists,
  removeAllFilesWithExtension,
} from '../file.util';

import * as XLSX from 'xlsx';

export function generateStoreDownloadedPathForEachProject(projectName: string) {
  const folderName =
    getIndexProjectByValue(projectName) + ENV.PARALLEL_RUN_INDEX;
  const downloadedPath = util.format(STORE_DOWNLOADED_REPORTS_PATH, folderName);
  return resolve(downloadedPath);
}

export function createDownloadedReportFolderForEachProject(
  projectName: string,
) {
  const downloadedPath = generateStoreDownloadedPathForEachProject(projectName);
  createFolderIfNotExists(downloadedPath);
}

function removeAllXlsxFiles(folderPath: string) {
  removeAllFilesWithExtension(folderPath, '.xlsx');
}

export function removeAllDownloadedReportXlsxFilesForEachProject(
  projectName: string,
) {
  const downloadedPath = generateStoreDownloadedPathForEachProject(projectName);
  removeAllXlsxFiles(downloadedPath);
}

export function readFirstSheetNameOfXlsxFile(filePath: string) {
  return readXlsxFile(filePath, 0);
}

export function readXlsxFile(filePath: string, sheetIndex: number) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[sheetIndex];
  const worksheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(worksheet);
  return json;
}
