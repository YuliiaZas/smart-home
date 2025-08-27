import { AbstractControl, FormGroup } from '@angular/forms';
import { Component, computed, inject, input, linkedSignal, OnInit } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { getValidationErrorMessage } from '@shared/validation';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { isObjectKey } from '@shared/utils';
import { InputType, PasswordDataInfo } from './models';
import { InputBase } from './typed-inputs/input-base';
import { passwordDataMap } from './constants/password-data-map';

@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, AsyncPipe],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class FormInput implements OnInit {
  #parentContainer = inject(ControlContainer);
  inputType = InputType;

  inputData = input.required<InputBase<string>>();

  currentElementType = linkedSignal(() => this.#getType(this.inputData().controlType));

  currentPasswordState = computed<PasswordDataInfo | null>(() => {
    const currentType = this.currentElementType();
    return isObjectKey(currentType, passwordDataMap) ? passwordDataMap[currentType] : null;
  });

  formControl: AbstractControl | undefined | null;

  get #parentContainerForm() {
    return this.#parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.formControl = this.#parentContainerForm?.get(this.inputData().controlKey);
  }

  getErrorMessage(): string {
    if (!this.formControl) return '';
    return getValidationErrorMessage(this.formControl, this.inputData().validationErrorOptions);
  }

  togglePasswordVisibility(event: MouseEvent) {
    if (this.inputData().controlType !== InputType.PASSWORD) return;
    const currentType = this.currentElementType();
    this.currentElementType.set(currentType === InputType.PASSWORD ? InputType.TEXT : InputType.PASSWORD);
    event.stopPropagation();
  }

  #getType(inputType: InputType): HTMLInputElement['type'] {
    switch (inputType) {
      case InputType.PASSWORD: {
        return 'password';
      }
      default: {
        return 'text';
      }
    }
  }
}
