import { InputBase } from './input-base';
import { InputType } from '..';
import { ValidatorFn } from '@angular/forms';
import { ValidationErrorOptions } from '@shared/models';

export class InputIcon<TKey extends string = string> extends InputBase<string, TKey> {
  override controlType = InputType.ICON;

  constructor(config: {
    controlKey: TKey;
    value?: string;
    label?: string;
    required?: boolean;
    hint?: string;
    validators?: ValidatorFn[];
    validationErrorOptions?: ValidationErrorOptions;
  }) {
    super(config);
  }
}
