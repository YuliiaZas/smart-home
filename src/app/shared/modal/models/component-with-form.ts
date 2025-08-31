import { Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface ComponentWithForm {
  form: Signal<FormGroup>;
}
