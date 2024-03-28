import { gmailUtil } from './gmail.util';
import { environment as ENV } from '../environment.util';
import { expect } from '@playwright/test';
import { DateTimeKey, OtpCodeTypeKey } from '../../enums/cache-data-key.enum';
import { getCache, setCache } from '../cache.util';
import { delay } from '../common.util';

export class EmailChecking {
  static otpEmailSender = ENV.NO_REPLY_QUIZRR_MAIL;
  static get optEmailSubject() {
    return 'Your Quizrr verification code';
  }
  static get trainingInviteTitle() {
    return 'Your Quizrr training invite';
  }

  // ======== Check OTP Email ========

  static getSendOtpCodeEmailTime() {
    return getCache<Date>(DateTimeKey.SEND_OTP_CODE_EMAIL);
  }

  static getSendTrainingInviteEmailTime() {
    return getCache<Date>(DateTimeKey.SEND_INVITE_EMAIL);
  }

  static async getOtpCodeFromEmail(receiverEmail: string): Promise<string> {
    const otpCode = await gmailUtil.getOtpCodeFromEmail(
      this.otpEmailSender,
      receiverEmail,
      this.optEmailSubject,
      this.getSendOtpCodeEmailTime(),
    );
    setCache(OtpCodeTypeKey.OTP_CODE, otpCode);
    return otpCode;
  }

  static async verifyAnOtpCodeShouldBeSentToEmail(emailReceiver: string) {
    const otpCode = await this.getOtpCodeFromEmail(emailReceiver);
    expect(otpCode).toBeDefined();
    expect(otpCode).not.toBeNull();
  }

  // ======== Check Invite Email ========

  static async verifyTheTrainingInviteShouldBeSentToEmail(
    receiverEmail: string,
  ) {
    const gmail = await gmailUtil.readLatestMatchedEmail(
      ENV.NO_REPLY_QUIZRR_MAIL,
      receiverEmail,
      this.trainingInviteTitle,
      this.getSendTrainingInviteEmailTime(),
    );
    expect(gmail).not.toBeNull();
  }
}
