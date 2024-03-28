import { hooks, mergeTests } from './hooks.fixture';
import {
  SignUpCreateFacilityPage,
  SignUpCreateFacilityTeamPage,
  SignUpEnterEmailPage,
  SignUpEnterOtpPage,
  SignUpInviteMemebersPage,
  CongratulationPage,
} from '../pages/dashboard/sign-up';
import {
  SignInEnterEmailPage,
  SignInEnterOtpPage,
  GoToTrainingPage,
} from '../pages/dashboard/sign-in';
import { FactoryPage } from '../pages/dashboard/app/factory/factory.page';
import { OverviewPage } from '../pages/dashboard/app/overview/overview.page';
import { signInTest, signUpTest } from './precondition';
import {
  InviteColleaguesPopupPage,
  TeamManagementPage,
  EditOrganizationInfoPopupPage,
  DownloadTrainingReportPopupPage,
} from '../pages/dashboard/app/account/team-management';
import {
  PrivacyPolicyPage,
  TermsAndConditionsOfUsePage,
} from '../pages/quizrr-se';
import {
  WebBasedWelcomePage,
  WebBasedLearningDashboardPage,
  WebBasedIntroduceVideoPage,
  WebBasedPrivacyInformationPage,
  WebBasedInputProfilePage,
} from '../pages/dashboard/web-based-training';
import { WebBasedAlmostTherePage } from '../pages/dashboard/web-based-training/almost-there.page';
import { WebBasedBaselineQuestionPage } from '../pages/dashboard/web-based-training/baseline-question.page';
import { WebBasedGameboardPage } from '../pages/dashboard/web-based-training/gameboard.page';
import { WebBasedLocationQuestionPage } from '../pages/dashboard/web-based-training/location-question.page ';
import { WebBasedPostFeedbackPage } from '../pages/dashboard/web-based-training/post-feedback.page';
import { WebBasedCongratulationsPage } from '../pages/dashboard/web-based-training/congratulations.page';

type DashboardFixtures = {
  signUpEnterEmailPage: SignUpEnterEmailPage;
  signUpEnterOtpPage: SignUpEnterOtpPage;
  signUpCreateFacilityPage: SignUpCreateFacilityPage;
  signUpCreateFacilityTeamPage: SignUpCreateFacilityTeamPage;
  signUpInviteMembersPage: SignUpInviteMemebersPage;
  signInEnterEmailPage: SignInEnterEmailPage;
  signInEnterOtpPage: SignInEnterOtpPage;
  privacyPolicyPage: PrivacyPolicyPage;
  termsAndConditionsPage: TermsAndConditionsOfUsePage;
  factoryPage: FactoryPage;
  teamManagementPage: TeamManagementPage;
  inviteColleaguesPopupPage: InviteColleaguesPopupPage;
  editOrganizationInfoPopupPage: EditOrganizationInfoPopupPage;
  downloadTrainingReportPopupPage: DownloadTrainingReportPopupPage;
  goToTrainingPage: GoToTrainingPage;
  overviewPage: OverviewPage;
  welcomePage: WebBasedWelcomePage;
  introduceVideoPage: WebBasedIntroduceVideoPage;
  learningDashboardPage: WebBasedLearningDashboardPage;
  privacyInfomationPage: WebBasedPrivacyInformationPage;
  inputProfilePage: WebBasedInputProfilePage;
  almostTherePage: WebBasedAlmostTherePage;
  baselineQuestionPage: WebBasedBaselineQuestionPage;
  gameboardPage: WebBasedGameboardPage;
  locationQuestionPage: WebBasedLocationQuestionPage;
  postFeedbackPage: WebBasedPostFeedbackPage;
  trainingCongratulationsPage: WebBasedCongratulationsPage;
  congratulationPage: CongratulationPage;
  updateResultsTestrails: any;
};

export const dashboardTest = hooks.extend<DashboardFixtures>({
  async signUpEnterEmailPage({ page }, use) {
    await use(new SignUpEnterEmailPage(page));
  },

  async signUpEnterOtpPage({ page }, use) {
    await use(new SignUpEnterOtpPage(page));
  },

  async signUpCreateFacilityPage({ page }, use) {
    await use(new SignUpCreateFacilityPage(page));
  },

  async signUpCreateFacilityTeamPage({ page }, use) {
    await use(new SignUpCreateFacilityTeamPage(page));
  },

  async signUpInviteMembersPage({ page }, use) {
    await use(new SignUpInviteMemebersPage(page));
  },

  async signInEnterEmailPage({ page }, use) {
    await use(new SignInEnterEmailPage(page));
  },

  async signInEnterOtpPage({ page }, use) {
    await use(new SignInEnterOtpPage(page));
  },

  async privacyPolicyPage({ page }, use) {
    await use(new PrivacyPolicyPage(page));
  },

  async termsAndConditionsPage({ page }, use) {
    await use(new TermsAndConditionsOfUsePage(page));
  },

  async factoryPage({ page }, use) {
    await use(new FactoryPage(page));
  },

  async teamManagementPage({ page }, use) {
    await use(new TeamManagementPage(page));
  },

  async inviteColleaguesPopupPage({ page }, use) {
    await use(new InviteColleaguesPopupPage(page));
  },

  async editOrganizationInfoPopupPage({ page }, use) {
    await use(new EditOrganizationInfoPopupPage(page));
  },

  async downloadTrainingReportPopupPage({ page }, use) {
    await use(new DownloadTrainingReportPopupPage(page));
  },

  async goToTrainingPage({ page }, use) {
    await use(new GoToTrainingPage(page));
  },

  async overviewPage({ page }, use) {
    await use(new OverviewPage(page));
  },

  async welcomePage({ page }, use) {
    await use(new WebBasedWelcomePage(page));
  },

  async introduceVideoPage({ page }, use) {
    await use(new WebBasedIntroduceVideoPage(page));
  },

  async learningDashboardPage({ page }, use) {
    await use(new WebBasedLearningDashboardPage(page));
  },

  async privacyInfomationPage({ page }, use) {
    await use(new WebBasedPrivacyInformationPage(page));
  },

  async inputProfilePage({ page }, use) {
    await use(new WebBasedInputProfilePage(page));
  },

  async almostTherePage({ page }, use) {
    await use(new WebBasedAlmostTherePage(page));
  },

  async baselineQuestionPage({ page }, use) {
    await use(new WebBasedBaselineQuestionPage(page));
  },

  async gameboardPage({ page }, use) {
    await use(new WebBasedGameboardPage(page));
  },

  async locationQuestionPage({ page }, use) {
    await use(new WebBasedLocationQuestionPage(page));
  },

  async postFeedbackPage({ page }, use) {
    await use(new WebBasedPostFeedbackPage(page));
  },

  async trainingCongratulationsPage({ page }, use) {
    await use(new WebBasedCongratulationsPage(page));
  },

  async congratulationPage({ page }, use) {
    await use(new CongratulationPage(page));
  },
});
export const test = mergeTests(dashboardTest, signInTest, signUpTest);
export { expect } from '@playwright/test';
