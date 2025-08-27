import { AbstractControl } from '@angular/forms';
import { ERROR_MESSAGES } from '@shared/constants';
import { isObjectKey } from '@shared/utils';

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
    if (isObjectKey(errorKey, ERROR_MESSAGES.formValidation)) {
      if (errorKey === 'defaultError' && validationErrorOptions?.skipDefaultError) return '';
      if (errorKey === 'minlength' || errorKey === 'maxlength') {
        const requiredLength = formControl.getError(errorKey).requiredLength;
        return ERROR_MESSAGES.formValidation[errorKey](requiredLength);
      }
      if (errorKey === 'notUnique') {
        return ERROR_MESSAGES.formValidation[errorKey](validationErrorOptions?.uniqueArea);
      }
      return ERROR_MESSAGES.formValidation[errorKey];
    }
    return ERROR_MESSAGES.formValidation.defaultError;
  });

  return errorMessagesArray.join('. ');
}
