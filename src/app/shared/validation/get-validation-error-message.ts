import { AbstractControl } from '@angular/forms';
import { ERROR_MESSAGES } from '@shared/constants';
import { ValidationErrorOptions } from '@shared/models';
import { isObjectKey } from '@shared/utils';

export function getValidationErrorMessage(
  formControl: AbstractControl,
  validationErrorOptions?: ValidationErrorOptions
): string {
  if (!formControl.errors) return '';
  const errorsArray = Object.keys(formControl.errors);

  const errorMessagesArray = errorsArray.map((errorKey) => {
    if (isObjectKey(errorKey, ERROR_MESSAGES.formValidation)) {
      if (errorKey === 'defaultError' && validationErrorOptions?.skipDefaultError) return '';

      switch (errorKey) {
        case 'pattern': {
          const requiredPattern =
            validationErrorOptions?.requiredPattern || formControl.getError(errorKey).requiredPattern;
          return ERROR_MESSAGES.formValidation[errorKey](requiredPattern);
        }

        case 'minlength':
        case 'maxlength': {
          const requiredLength = formControl.getError(errorKey).requiredLength;
          return ERROR_MESSAGES.formValidation[errorKey](requiredLength);
        }

        case 'maxLengthConditional': {
          const { requiredLength, key } = formControl.getError(errorKey);
          return ERROR_MESSAGES.formValidation[errorKey](requiredLength, key);
        }

        case 'notUnique': {
          return ERROR_MESSAGES.formValidation[errorKey](validationErrorOptions?.uniqueArea);
        }

        default: {
          return ERROR_MESSAGES.formValidation[errorKey];
        }
      }
    }
    return ERROR_MESSAGES.formValidation.defaultError;
  });

  return errorMessagesArray.join('. ');
}
