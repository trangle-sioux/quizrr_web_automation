import { WAIT_IN_2_MINUTES } from '../../../../../../constants';
import { test } from '../../../../../../fixtures/dashboard.fixture';

test.describe('Web-based training', () => {
  test.beforeEach(
    'the user signed up with owner account',
    async (
      { theUserSignedUpTo4ModulesTrainingByOwnerAccount: theUserSignedUp },
      testInfo,
    ) => {
      testInfo.setTimeout(WAIT_IN_2_MINUTES);
      const overviewPage = theUserSignedUp;
      await overviewPage.acceptCookies();
      await overviewPage.closeGuidelinePopup();
      -(await overviewPage.clickOnStartTrainingButton());
    },
  );

  test('@C16985: Full workflow with Owner account @Critical', async ({
    welcomePage,
    introduceVideoPage,
    learningDashboardPage,
    privacyInfomationPage,
    inputProfilePage,
    almostTherePage,
    baselineQuestionPage,
    gameboardPage,
    locationQuestionPage,
    postFeedbackPage,
    trainingCongratulationsPage: congratulationPage,
    overviewPage,
  }) => {
    test.slow();
    // Verify displaying the Welcome page
    // TODO: uncomment after the bug fixed: https://sioux.atlassian.net/browse/QTD-4616
    // await welcomePage.verifyTheToggleOptionsShouldBeDisplayed();
    await welcomePage.verifyTheStartButtonShouldBeDisplayed();

    await welcomePage.clickOnStartButton();

    // Verify displaying the Introduce Video page
    await introduceVideoPage.verifyTheIntroduceVideoShouldBeDisplayed();
    await introduceVideoPage.verifyTheNextButtonShouldBeDisplayed();

    await introduceVideoPage.clickOnNextButton();

    // Verify showing the coresponding Learning Dashboard page
    await learningDashboardPage.verifyTheLearningDashboardShouldBeDisplayedCorrectly();

    await learningDashboardPage.closeGuidelinePopup();
    await learningDashboardPage.clickOnTheFirstLearningModule();

    // Verify showing the Privacy Infomation page
    await privacyInfomationPage.verifyTheTitleShouldBeDisplayed();
    await privacyInfomationPage.verifyTheVoiceOverButtonShouldBeDisplayed();
    await privacyInfomationPage.verifyTheAgreeButtonShouldBeDisplayed();
    await privacyInfomationPage.clickOnPrivacyAgreeButton();

    await inputProfilePage.submitAFilledProfile();

    // Verify showing the Almost there page
    await almostTherePage.verifyTheDescriptionTextShouldBeCorrect();
    await almostTherePage.verifyTheOkLetGoButtonShouldBeCorrect();

    await almostTherePage.clickOnOkLetGoButton();

    // Verify showing baseline survey question
    await baselineQuestionPage.verifyBaselineQuestionPageShouldBeDisplayed();

    // Complete 1st module
    await baselineQuestionPage.answerAllQuestionWithCorrectAnswers();
    await gameboardPage.clickOnFirstQuestionLocationIcon();
    await locationQuestionPage.answerAllQuestionCorrectAndWatchingVideo();
    await postFeedbackPage.answerAllQuestions();

    // Verify showing the Module Completed Congratulation page correctly
    await congratulationPage.verifyTheModuleCompletedTitleShouldBeDisplayed();
    await congratulationPage.verifyTheModuleCompletedSubTitleShouldBeDisplayed();
    await congratulationPage.verifyTheModuleCompletedCorrectAnswerRateShouldBeCorrect();
    await congratulationPage.verifyTheContinueNextModuleShouldBeDisplayed();

    await congratulationPage.clickOnContinueToNextModuleButton();

    // Verify showing the next module
    await almostTherePage.verifyTheModuleNameShouldBeCorrect();

    // Answer 2 question of 2nd module then quit
    await almostTherePage.clickOnOkLetGoButton();
    await baselineQuestionPage.answerAllQuestionWithCorrectAnswers();
    await gameboardPage.clickOnFirstQuestionLocationIcon();
    await locationQuestionPage.answerQuestionsWithCorrectAnswersToQuestionOrder(
      2,
    );
    await locationQuestionPage.quitCurrentTraining();

    // Complete the 3th module
    await learningDashboardPage.clickOnTheLearningModuleNumber(3);
    await almostTherePage.clickOnOkLetGoButton();
    await baselineQuestionPage.answerAllQuestionWithCorrectAnswers();
    await gameboardPage.clickOnFirstQuestionLocationIcon();
    await locationQuestionPage.answerAllQuestionCorrect();
    await postFeedbackPage.answerAllQuestions();

    // Verify showing the Module Completed Congratulation page correctly
    await congratulationPage.verifyTheModuleCompletedSubTitleShouldBeDisplayed();
    await congratulationPage.verifyTheModuleCompletedCorrectAnswerRateShouldBeCorrect();

    await congratulationPage.clickOnContinueToNextModuleButton();

    // Complete the in-progress 2nd module
    await locationQuestionPage.continueAnsweringRemainingQuestionsOfModuleOrder(
      2,
      3,
    );
    await postFeedbackPage.answerAllQuestions();

    // Verify showing the Module Completed Congratulation page correctly
    await congratulationPage.verifyTheModuleCompletedSubTitleShouldBeDisplayed();
    await congratulationPage.verifyTheModuleCompletedCorrectAnswerRateShouldBeCorrect();

    await congratulationPage.clickOnContinueToNextModuleButton();

    // Verify showing the 4th module
    await almostTherePage.verifyTheModuleNameShouldBeDisplayedWithModuleOrder(
      4,
    );

    // Complete 4th module
    await almostTherePage.clickOnOkLetGoButton();
    await baselineQuestionPage.answerAllQuestionWithCorrectAnswers(4);
    await gameboardPage.clickOnFirstQuestionLocationIcon();
    await locationQuestionPage.answerAllQuestionCorrect();
    await postFeedbackPage.answerAllQuestions();

    // Verify showing the Module Completed Congratulation page correctly for the lastest module
    await congratulationPage.verifyTheModuleCompletedTitleShouldBeDisplayed();
    await congratulationPage.verifyTheModuleCompletedSubTitleShouldBeDisplayed();
    await congratulationPage.verifyTheModuleCompletedCorrectAnswerRateShouldBeCorrect();
    await congratulationPage.verifyTheViewLearningResultButtonShouldBeDisplayed();

    await congratulationPage.clickOnViewLearningResultButton();

    // Verify the View results (training completed) page should be correct
    await congratulationPage.verifyTheTrainingCompletedTitleShouldBeDisplayed();
    await congratulationPage.verifyTheTrainingCompletedSubTitleShouldBeDisplayed();
    await congratulationPage.verifyTheTrainingCompletedLearningModuleNamesShouldBeCorrect();
    await congratulationPage.verifyTheTrainingCompletedCorrectAnswerRatesShouldBeCorrect();
    await congratulationPage.verifyTheTotalTrainingTokenRateShouldBeCorrect();

    await congratulationPage.clickOnCloseThisPageButton();

    // Verify hidding the Web-based training and showing the Overview page
    await congratulationPage.verifyTheWebasedTrainingShouldBeHidden();
    await overviewPage.verifyTheOverviewPageShouldBeDisplayed();

    await overviewPage.clickOnStartTrainingButton();
    await welcomePage.clickOnStartButton();
    await introduceVideoPage.clickOnNextButton();

    // Verify showing the Dashboard page with the training data
    await learningDashboardPage.verifyTheLearningDashboardShouldBeDisplayedCorrectly();
    await learningDashboardPage.verifyTheDashboardShouldDisplayCorrectCompletedTrainingData();

    await learningDashboardPage.clickOnTheFirstLearningModule();

    // Verify not displaying the Privacy + Input Players Profile pages
    await privacyInfomationPage.verifyTheTitleShouldBeHidden();
    await inputProfilePage.verifyTheInputProfilePageShouldBeHidden();

    // Verify navigating Almost There page if there is baseline question
    // Verify navigating 1st location question if there is no baseline question
    await almostTherePage.verifyTheModuleNameShouldBeCorrect();
  });
});
