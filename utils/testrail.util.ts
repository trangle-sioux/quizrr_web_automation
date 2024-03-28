import { REGEX_ANSI_COLORS } from '../constants/regex.constant';
import { COLON_SYMBOL, COMMA_SYMBOL } from '../constants/symbols.constant';
import { environment as ENV } from './environment.util';
import { extractNumberFromString } from './string.util';

const client_options = require('testrail-api-client').default;

const options = {
  domain: ENV.TESTRAIL_DOMAIN,
  username: ENV.TESTRAIL_USERNAME,
  password: ENV.TESTRAIL_APIKEY,
};

const client = new client_options(options);

function getTestCasesId(testTitle: string) {
  const caseIdStr: string = testTitle.split(COLON_SYMBOL)[0].trim();
  const caseId: number = Number(extractNumberFromString(caseIdStr));
  return caseId;
}

function formatErrorMessage(testErrors: any) {
  let errorMess: any = testErrors.message;
  let formatErorMess: string = errorMess.replace(REGEX_ANSI_COLORS, '');
  return formatErorMess.split('Call log:').shift();
}

function getTestCasesResultStatusId(status: string) {
  return 'passed' === status.toLowerCase() ? 1 : 5;
}

function createComment(
  status: string,
  testOn: string,
  testErrors: any,
  testEnvironment?: string,
) {
  const isCasePassed: boolean = status.toLowerCase() == 'passed';
  status = isCasePassed ? 'passed' : 'failed';
  let cmtMess = `This test was marked as **${status}** by automation testing. \n **Run on:**  ${testOn} \n`;
  if (testEnvironment !== undefined) {
    cmtMess = `${cmtMess} **Testing environment:** ${testEnvironment} \n`;
  }
  if (!isCasePassed) {
    let formatErorMess = formatErrorMessage(testErrors);
    cmtMess = cmtMess + `**Error:** ${formatErorMess}`;
  }
  return cmtMess;
}

export async function updateTestCaseStatusToTestrail(
  testRunId: string,
  caseTitle: string,
  status: string,
  testOn: string,
  testErrors: any,
  testEnvironment?: string,
) {
  const caseId: number = getTestCasesId(caseTitle);
  const statusId: number = getTestCasesResultStatusId(status);
  const runIds: string[] = testRunId.split(COMMA_SYMBOL);
  const comment = createComment(status, testOn, testErrors, testEnvironment);
  const reportTests = [
    { case_id: caseId, status_id: statusId, comment: comment },
  ];
  for (let index in runIds) {
    const runId = runIds[index];
    try {
      await client.addResultsForCases(runId, reportTests);
    } catch (err) {
      console.log(err);
    }
  }
}
