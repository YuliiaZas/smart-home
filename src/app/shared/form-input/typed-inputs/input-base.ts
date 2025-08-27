import { ValidatorFn } from '@angular/forms';
import { ValidationErrorOptions } from '@shared/validation';
import { InputType } from '../models/input-type';

export class InputBase<T> {
  controlType: InputType;
  controlKey: string;
  value?: T | undefined;
  label: string;
  required: boolean;
  validators: ValidatorFn[];
  validationErrorOptions?: ValidationErrorOptions;

  constructor(options: {
    controlType?: InputType;
    controlKey?: string;
    value?: T | undefined;
    label?: string;
    required?: boolean;
    validators: ValidatorFn[];
    validationErrorOptions?: ValidationErrorOptions;
  }) {
    this.controlType = options.controlType || InputType.TEXT;
    this.controlKey = options.controlKey || '';
    this.value = options.value;
    this.label = options.label || '';
    this.required = !!options.required;
    this.validators = options.validators || [];
    this.validationErrorOptions = options.validationErrorOptions || {};
  }
}
