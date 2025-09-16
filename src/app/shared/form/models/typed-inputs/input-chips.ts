import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { ValidationErrorOptions } from '@shared/models';
import { InputType, OptionInfo } from '..';
import { InputBase } from './input-base';

export class InputChips<TValue, TKey extends string = string, TOption = TValue> extends InputBase<
  TValue[],
  TKey,
  TOption
> {
  override controlType = InputType.CHIPS;

  constructor(config: {
    controlKey: TKey;
    value?: TValue[];
    options?: OptionInfo<TOption>[];
    optionsAsync?: Observable<OptionInfo<TOption>[]>;
    label?: string;
    required?: boolean;
    hint?: string;
    validators?: ValidatorFn[];
    validationErrorOptions?: ValidationErrorOptions;
  }) {
    super(config);

    this.value = config.value || [];

    if (!this.hasSyncOptions() && !this.hasAsyncOptions()) {
      throw new Error('The "options" or "optionsAsync" property is required for InputChips.');
    }

    if (this.hasSyncOptions() && this.hasAsyncOptions()) {
      throw new Error('Cannot provide both "options" and "optionsAsync".');
    }
  }
}
