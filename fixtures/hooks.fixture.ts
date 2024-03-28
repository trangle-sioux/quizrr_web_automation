import { test as base } from '@playwright/test';
import { updateTestCaseStatusToTestrail } from '../utils/testrail.util';
import { environment as ENV } from '../utils/environment.util';
import { clearCache } from '../utils/cache.util';

type MyFixtures = {
  updateResultsToTestrail: any;
};

export const hooks = base.extend<MyFixtures>({
  updateResultsToTestrail: [
    async ({}, use: any, testInfo: any) => {
      await use();
      clearCache();

      const testRunIds = ENV.TESTRAIL_TESTRUN_IDS;
      const testEnvironment = ENV.TEST_ENVIRONMENT;
      if (testRunIds) {
        const testErrors: any = testInfo.error;
        const testStatus: string = testInfo.status!;
        const testProject: string = testInfo.project.name;
        const testTitle: string = testInfo.title;
        await updateTestCaseStatusToTestrail(
          testRunIds,
          testTitle,
          testStatus,
          testProject,
          testErrors,
          testEnvironment,
        );
      }
    },
    { auto: true },
  ],
});

export { expect, mergeTests } from '@playwright/test';
