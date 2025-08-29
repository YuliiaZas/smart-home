import { AbstractControl } from '@angular/forms';
import { ERROR_MESSAGES, UNIQUE_AREA } from '@shared/constants';
import { Entity } from '@shared/models';
import { isObjectKey } from '@shared/utils';

export interface ValidationErrorOptions {
  uniqueArea?: Entity;
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
        const uniqueArea = validationErrorOptions?.uniqueArea ? UNIQUE_AREA[validationErrorOptions.uniqueArea] : '';
        return ERROR_MESSAGES.formValidation[errorKey](uniqueArea);
      }
      return ERROR_MESSAGES.formValidation[errorKey];
    }
    return ERROR_MESSAGES.formValidation.defaultError;
  });

  return errorMessagesArray.join('. ');
}
