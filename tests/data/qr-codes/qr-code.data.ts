import { environment as ENV } from '../../../utils/environment.util';
import * as util from 'util';
import { QR_CODES_DATA_TEST_PATH } from '../../../constants';
import { getEnumEnvironment } from '../../../enums';
import { readJsonFile } from '../../../utils';

function getQRCodesDataPath() {
  const env = ENV.TEST_ENVIRONMENT;
  return util.format(QR_CODES_DATA_TEST_PATH, getEnumEnvironment(env));
}

const QR_CODES_DATA = readJsonFile(getQRCodesDataPath());

function filterQRCodesById(id: string) {
  return QR_CODES_DATA.filter((qrCodes: any) => qrCodes._id.$oid == id);
}

export function getQRCodeConfigTrainingSeriesList(qrCodeId: string) {
  const qrCodes = filterQRCodesById(qrCodeId);
  let trainingSeriesLst;
  if (qrCodes.length == 0) {
    throw new Error(
      `There is no ${qrCodeId} QRCode id found in path '${getQRCodesDataPath()}'`,
    );
  } else {
    trainingSeriesLst = qrCodes[0].config.trainingSeriesList;
  }
  return trainingSeriesLst;
}
