import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
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
        validators: [Validators.minLength(2)],
        validationErrorOptions: { skipDefaultError: true },
      }),
      new InputPassword({
        controlKey: 'password',
        label: 'Password',
        required: true,
        validators: [Validators.minLength(2)],
        validationErrorOptions: { skipDefaultError: true },
      }),
    ];
  }

  getInputsDataForSignup(): InputBase<string>[] {
    return [
      ...this.getInputsData(),
      new InputText({
        controlKey: 'fullName',
        label: 'Full Name',
        validators: [Validators.minLength(2)],
        validationErrorOptions: { skipDefaultError: true },
      }),
    ];
  }
}
