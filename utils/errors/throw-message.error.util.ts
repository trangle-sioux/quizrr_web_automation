import { ValidationError } from './validation.error.util';

export function validateReturnValueType(returnVal: any, message?: string) {
  if (returnVal === null || returnVal === undefined) {
    if (message === undefined) {
      throw new ValidationError(`Return value is ${returnVal}.`);
    } else {
      throw new ValidationError(message);
    }
  } else {
    return returnVal;
  }
}

export function switchCaseUndefined(caseValue: string) {
  throw new ValidationError(
    `The switch expression is undefined with the value ${caseValue}. Please add a case to handle it.`,
  );
}
