import { ValidatorFn } from '@angular/forms';
import { ValidationErrorOptions } from '@shared/models';
import { InputType, OptionInfo } from '..';
import { InputBase } from './input-base';
import { Observable } from 'rxjs';

export class InputSelect<TValue, TKey extends string = string> extends InputBase<TValue, TKey> {
  override controlType = InputType.SELECT;

  constructor(config: {
    controlKey: TKey;
    value?: TValue;
    options?: OptionInfo<TValue>[];
    optionsAsync?: Observable<OptionInfo<TValue>[]>;
    label?: string;
    required?: boolean;
    hint?: string;
    validators?: ValidatorFn[];
    validationErrorOptions?: ValidationErrorOptions;
  }) {
    super(config);

    if (!this.hasSyncOptions() && !this.hasAsyncOptions()) {
      throw new Error('The "options" or "optionsAsync" property is required for InputSelect.');
    }

    if (this.hasSyncOptions() && this.hasAsyncOptions()) {
      throw new Error('Cannot provide both "options" and "optionsAsync".');
    }
  }
}
