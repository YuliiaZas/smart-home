import { InputSignal } from '@angular/core';
import { InputBase } from '@shared/form';

export interface ComponentWithForm<TFormValue> {
  controlsInfo: InputSignal<InputBase<TFormValue[keyof TFormValue]>[]>;
  errorMessage: InputSignal<string>;
  handleFormSubmit: () => TFormValue | undefined;
}
