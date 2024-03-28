import { findLastAndMatchedDocument } from '../utils/database-searching.util';
import { ObjectId } from 'mongodb';
import { environment as ENV } from '../utils/environment.util';
import { validateReturnValueType } from '../utils/errors/throw-message.error.util';

const databaseName: string = ENV.DB_QUIZRR_NAME;
const usersV2CollectionName = 'users-v2';
const optCollectionName = 'otps';

export class User {
  async getUserV2ByEmailAdress(emailAdrress: string) {
    const query = { email: emailAdrress };
    return findLastAndMatchedDocument(
      databaseName,
      usersV2CollectionName,
      query,
    );
  }

  async getOptObjectIdByEmailAddress(emailAdrress: string) {
    const usersV2Data = await this.getUserV2ByEmailAdress(emailAdrress);
    return validateReturnValueType(usersV2Data).otp;
  }

  async getCodeByEmailAdress(emailAdrress: string): Promise<string> {
    const otpObjectId = await this.getOptObjectIdByEmailAddress(emailAdrress);
    const query = {
      _id: new ObjectId(otpObjectId),
    };
    const otpsData = await findLastAndMatchedDocument(
      databaseName,
      optCollectionName,
      query,
    );
    return validateReturnValueType(otpsData).code;
  }
}
