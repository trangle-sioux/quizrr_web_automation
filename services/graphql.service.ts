import { request } from '@playwright/test';
import { GRAPHQL_URL } from '../constants';
import { Environments, HeadersKey, HeadersValue } from '../enums';
import { getTestingEnvironmentViaUrl } from '../utils';

export async function sendGraphQl(
  accessToken: string,
  queryValue: string,
  variablesValue: string,
) {
  return (await request.newContext()).post(GRAPHQL_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      [HeadersKey.CONTENT_TYPE]: HeadersValue.CONTENT_TYPE_JSON,
      origin: getCorrespondingOrigin(),
    },
    data: {
      query: queryValue,
      variables: variablesValue,
    },
  });
}

function getCorrespondingOrigin() {
  const env = getTestingEnvironmentViaUrl(GRAPHQL_URL);
  switch (env) {
    case Environments.STAGING:
      return HeadersValue.STAGING_ORIGIN;
    case Environments.DEVELOP:
      return HeadersValue.DEV_ORIGIN;
    case Environments.PRODUCTION:
      return HeadersValue.PRODUTION_ORIGIN;
    default:
      throw Error(
        `The ${env} is not valid. It should be 'staging' or 'dev' or 'prod'`,
      );
  }
}
