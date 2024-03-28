export const enum Environments {
  STAGING = 'staging',
  DEVELOP = 'dev',
  PRODUCTION = 'prod',
}

export function getEnumEnvironment(environment?: string) {
  const env = environment ?? 'dev';
  switch (env) {
    case Environments.STAGING:
      return Environments.STAGING;
    case Environments.DEVELOP:
      return Environments.DEVELOP;
    case Environments.PRODUCTION:
      return Environments.PRODUCTION;
    default:
      throw Error(
        `The ${env} is not valid. It should be 'staging' or 'dev' or 'prod'`,
      );
  }
}
