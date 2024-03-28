import { Email, get_messages } from 'gmail-tester';
import { delay } from '../common.util';
import { getUnixEpochTime } from '../datetime.util';
import { AT_SIGN_SYMBOL } from '../../constants/symbols.constant';
import { environment as ENV } from '../environment.util';
import { ValidationError } from '../errors/validation.error.util';
import { getIndexProjectByValue, AccountRole } from '../../enums';
import * as util from 'util';

const cheerio = require('cheerio');
const emailCredential = ENV.GMAIL_CREDENTIALS;
const gmailToken = ENV.GMAIL_TOKEN;

export const gmailUtil = {
  async messageChecker(
    fromEmail: string,
    toEmail: string,
    subject: string,
    afterDate: Date,
  ) {
    const email = await get_messages(emailCredential, gmailToken, {
      from: fromEmail,
      to: toEmail,
      subject,
      include_body: true,
      after: afterDate,
    });
    if (email === undefined) {
      throw new ValidationError(
        'Email value is returned undefined. Please check the input of the given parameters again.',
      );
    } else {
      return email;
    }
  },

  async readLatestMatchedEmail(
    senderEmail: string,
    receiverEmail: string,
    subject: string,
    afterDate: Date,
  ): Promise<string> {
    let emails = await gmailUtil.checkForMatchingEmails(
      senderEmail,
      receiverEmail,
      subject,
      afterDate,
    );
    let result = '';
    if (emails[0].body?.html) {
      result = emails[0].body?.html;
    } else {
      throw new Error('The matched email was not found.');
    }
    return result;
  },

  async checkForMatchingEmails(
    senderEmail: string,
    receiverEmail: string,
    subject: string,
    afterDate: Date,
  ): Promise<Email[]> {
    let emails = await gmailUtil.messageChecker(
      senderEmail,
      receiverEmail,
      subject,
      afterDate,
    );
    const startTime = Date.now();
    // Check mail every 0,5s, max wait time: 3 min
    while (emails.length === 0 && Date.now() - startTime < 180000) {
      await delay(500);
      emails = await gmailUtil.messageChecker(
        senderEmail,
        receiverEmail,
        subject,
        afterDate,
      );
    }
    return emails;
  },

  async getBodyText(html: any) {
    const $ = cheerio.load(html);
    return $('body').find('table.body-action table td').text();
  },

  async getOtpCode(text: any) {
    const otpCode: string = text.match(/\d+/g)[0];
    return otpCode;
  },

  async extractOtpCode(emailBodyHtml: any): Promise<string> {
    const actualMessage = await this.getBodyText(emailBodyHtml); // Get text from body
    return this.getOtpCode(actualMessage);
  },

  async getPasswordResetLink(html: any) {
    const $ = cheerio.load(html);
    const link = $('a:contains("click here")'); // "click here" link
    return link.attr('href');
  },

  async getOtpCodeFromEmail(
    emailSender: string,
    emailReceiver: string,
    emailSubject: string,
    fromDate: Date,
  ): Promise<string> {
    const gmailHtml = await gmailUtil.readLatestMatchedEmail(
      emailSender,
      emailReceiver,
      emailSubject,
      fromDate,
    );
    return gmailUtil.extractOtpCode(gmailHtml);
  },

  generateNewEmailAddressForEachProject(
    orignalEmail: string,
    role: string,
    projectName: string,
  ) {
    const unixTimeStr: string = getUnixEpochTime().toString();
    const spitOrignalEmail: string[] = orignalEmail.split(AT_SIGN_SYMBOL);
    const gmailName: string = spitOrignalEmail[0];
    const gmailTail: string = spitOrignalEmail[1];
    const prefixProject: string =
      getIndexProjectByValue(projectName).toString();
    const parallelRunIndex = ENV.PARALLEL_RUN_INDEX;
    const email = `${gmailName}+%s${prefixProject}${parallelRunIndex}${unixTimeStr}${AT_SIGN_SYMBOL}${gmailTail}`;
    switch (role.toLowerCase()) {
      case AccountRole.OWNER: {
        console.log('======= OWNER ACCOUNT ====: ' + util.format(email, role));
        return util.format(email, role);
      }
      case AccountRole.TEAM_ADMIN: {
        return util.format(email, role);
      }
      default: {
        return util.format(email, AccountRole.USER);
      }
    }
  },
};
