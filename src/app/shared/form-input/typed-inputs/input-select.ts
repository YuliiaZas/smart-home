import { ValidatorFn } from '@angular/forms';
import { ValidationErrorOptions } from '@shared/validation';
import { InputType, OptionInfo } from '../models';
import { InputBase } from './input-base';

export class InputSelect<K = OptionInfo> extends InputBase<string, K> {
  override controlType = InputType.SELECT;

  constructor(options: {
    controlKey: string;
    value?: string;
    options: K[];
    label?: string;
    required?: boolean;
    hint?: string;
    validators?: ValidatorFn[];
    validationErrorOptions?: ValidationErrorOptions;
  }) {
    super(options);

    if (!this.hasSyncOptions()) {
      throw new Error('The "options" property is required for InputSelect.');
    }
  }
}
