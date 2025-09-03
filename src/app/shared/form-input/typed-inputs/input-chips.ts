import { ValidatorFn } from '@angular/forms';
import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidationErrorOptions } from '@shared/validation';
import { InputType, OptionInfo } from '../models';
import { InputBase } from './input-base';

export class InputChips<K extends OptionInfo> extends InputBase<string> {
  override controlType = InputType.CHIPS;
  override value: string[];

  constructor(options: {
    controlKey: string;
    value?: string[];
    options?: K[];
    optionsAsync: Observable<K[]>;
    optionTemplate?: Type<unknown>;
    label?: string;
    required?: boolean;
    hint?: string;
    validators?: ValidatorFn[];
    validationErrorOptions?: ValidationErrorOptions;
  }) {
    super(options);

    if (!this.hasSyncOptions() && !this.hasAsyncOptions()) {
      throw new Error('The "options" or "optionsAsync" property is required for InputChips.');
    }

    if (this.hasSyncOptions() && this.hasAsyncOptions()) {
      throw new Error('Cannot provide both "options" and "optionsAsync".');
    }

    this.value = options.value || [];
  }
}
