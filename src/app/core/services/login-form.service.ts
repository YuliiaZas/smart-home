import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { PATTERN_VALIDATION_MESSAGES, VALIDATION_LIMITS } from '@shared/constants';
import { InputBase, InputPassword, InputText } from '@shared/form';

@Injectable({
  providedIn: 'root',
})
export class LoginFormService {
  getInputsData(): InputBase<string>[] {
    return [
      new InputText({
        controlKey: 'userName',
        label: 'Username',
        required: true,
        validators: [Validators.minLength(VALIDATION_LIMITS.USERNAME_MIN_LENGTH)],
        validationErrorOptions: { skipDefaultError: true },
      }),
      new InputPassword({
        controlKey: 'password',
        label: 'Password',
        required: true,
        validators: [Validators.pattern(VALIDATION_LIMITS.PATTERN.PASSWORD)],
        validationErrorOptions: { skipDefaultError: true, patternMessage: PATTERN_VALIDATION_MESSAGES.PASSWORD },
      }),
    ];
  }

  getInputsDataForSignup(): InputBase<string>[] {
    return [
      ...this.getInputsData(),
      new InputText({
        controlKey: 'fullName',
        label: 'Full Name',
        validators: [Validators.minLength(VALIDATION_LIMITS.FULL_NAME_MIN_LENGTH)],
        validationErrorOptions: { skipDefaultError: true },
      }),
    ];
  }
}
