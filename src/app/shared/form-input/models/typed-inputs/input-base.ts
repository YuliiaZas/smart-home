import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { ValidationErrorOptions } from '@shared/validation';
import { InputType } from '../input-type';
import { OptionInfo } from '..';

export class InputBase<T, K = OptionInfo> {
  controlType: InputType;
  controlKey: string;
  value: T | T[] | undefined;
  options: K[] | undefined;
  optionsAsync?: Observable<K[]>;
  label: string;
  required: boolean;
  hint: string;
  validators: ValidatorFn[];
  validationErrorOptions: ValidationErrorOptions;

  constructor(options: {
    controlType?: InputType;
    controlKey: string;
    value?: T | T[] | undefined;
    options?: K[];
    optionsAsync?: Observable<K[]>;
    label?: string;
    required?: boolean;
    hint?: string;
    validators?: ValidatorFn[];
    validationErrorOptions?: ValidationErrorOptions;
  }) {
    this.controlType = options.controlType || InputType.TEXT;
    this.controlKey = options.controlKey;
    this.value = options.value;
    this.options = options.options;
    this.optionsAsync = options.optionsAsync;
    this.label = options.label || '';
    this.required = !!options.required;
    this.hint = options.hint || '';
    this.validators = options.validators || [];
    this.validationErrorOptions = options.validationErrorOptions || {};
  }

  hasAsyncOptions(): boolean {
    return !!this.optionsAsync;
  }

  hasSyncOptions(): boolean {
    return !!this.options && this.options.length > 0;
  }
}
