import { Component, ChangeDetectionStrategy, inject, input, computed, output, effect } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ComponentWithForm } from '@shared/models';
import { FormControlsService } from '@shared/form/services';
import { FormInput, InputBase } from '../form-input';

export interface FormControlsError {
  errors: Record<string, boolean> | null;
  controlNames: string[];
}

@Component({
  selector: 'app-base-form',
  imports: [ReactiveFormsModule, MatError, MatButtonModule, FormInput],
  templateUrl: './base-form.html',
  styleUrls: ['./base-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseForm<TFormValue> implements ComponentWithForm<TFormValue> {
  #formControlsService = inject(FormControlsService);

  controlsInfo = input<InputBase<TFormValue[keyof TFormValue]>[]>([]);
  errorMessage = input<string>('');
  showError = input<boolean>(false);
  submitButtonText = input<string>('');
  disableSubmitWhileInvalid = input<boolean>(true);
  globalControlsErrors = input<FormControlsError | null>(null);

  formSubmit = output<TFormValue>();
  formFocus = output<void>();

  form = computed(() => this.#formControlsService.toFormGroup(this.controlsInfo()));

  constructor() {
    effect(() => {
      const globalErrors = this.globalControlsErrors();
      if (globalErrors) {
        for (const controlName of globalErrors.controlNames) {
          const control = this.form().get(controlName);
          if (control) {
            control.setErrors(globalErrors.errors);
            control.markAsTouched();
          }
        }
      }
    });
  }

  handleFormSubmit(): TFormValue | undefined {
    this.form().markAllAsTouched();
    this.form().updateValueAndValidity();

    if (this.form().valid) {
      const formValue = this.form().getRawValue();
      this.formSubmit.emit(formValue);
      return formValue;
    }
    return;
  }
}
