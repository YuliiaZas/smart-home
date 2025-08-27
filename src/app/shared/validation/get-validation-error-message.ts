import { AbstractControl } from '@angular/forms';
import { ERROR_MESSAGES } from '@shared/constants';

function isErrorKey(key: string): key is keyof typeof ERROR_MESSAGES.formValidation {
  return key in ERROR_MESSAGES.formValidation;
}

export interface ValidationErrorOptions {
  uniqueArea?: string;
  skipDefaultError?: boolean;
}

export function getValidationErrorMessage(
  formControl: AbstractControl,
  validationErrorOptions?: ValidationErrorOptions
): string {
  if (!formControl.errors) return '';
  const errorsArray = Object.keys(formControl.errors);

  const errorMessagesArray = errorsArray.map((errorKey) => {
    if (isErrorKey(errorKey)) {
      if (errorKey === 'minlength' || errorKey === 'maxlength') {
        const requiredLength = formControl.getError(errorKey).requiredLength;
        return ERROR_MESSAGES.formValidation[errorKey](requiredLength);
      }
      if (errorKey === 'notUnique') {
        return ERROR_MESSAGES.formValidation[errorKey](validationErrorOptions?.uniqueArea);
      }
      return validationErrorOptions?.skipDefaultError ? '' : ERROR_MESSAGES.formValidation[errorKey];
    }
    return ERROR_MESSAGES.formValidation.defaultError;
  });

  return errorMessagesArray.join('. ');
}
