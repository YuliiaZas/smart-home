import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { ValidationErrorOptions } from '@shared/models';
import { InputType } from '../input-type';
import { OptionInfo } from '..';

export class InputBase<TValue, TKey extends string = string, TOption = TValue> {
  controlType: InputType;
  controlKey: TKey;
  value: TValue | undefined;
  options: OptionInfo<TOption>[] | undefined;
  optionsAsync: Observable<OptionInfo<TOption>[]> | undefined;
  label: string;
  required: boolean;
  hint: string;
  validators: ValidatorFn[];
  validationErrorOptions: ValidationErrorOptions;

  constructor(config: {
    controlType?: InputType;
    controlKey: TKey;
    value?: TValue;
    options?: OptionInfo<TOption>[];
    optionsAsync?: Observable<OptionInfo<TOption>[]>;
    label?: string;
    required?: boolean;
    hint?: string;
    validators?: ValidatorFn[];
    validationErrorOptions?: ValidationErrorOptions;
  }) {
    this.controlType = config.controlType || InputType.TEXT;
    this.controlKey = config.controlKey;
    this.value = config.value;
    this.options = config.options;
    this.optionsAsync = config.optionsAsync;
    this.label = config.label || '';
    this.required = !!config.required;
    this.hint = config.hint || '';
    this.validators = config.validators || [];
    this.validationErrorOptions = config.validationErrorOptions || {};
  }

  hasAsyncOptions(): boolean {
    return !!this.optionsAsync;
  }

  hasSyncOptions(): boolean {
    return !!this.options && this.options.length > 0;
  }
}
