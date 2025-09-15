import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputBase } from '../components/form-input';

@Injectable({
  providedIn: 'root',
})
export class FormControlsService {
  toFormGroup<TFormValue>(inputsData: InputBase<TFormValue[keyof TFormValue]>[]): FormGroup {
    const group: Record<string, AbstractControl> = {};

    for (const inputData of inputsData) {
      const defaultValidators = inputData.required ? [Validators.required] : [];
      group[inputData.controlKey] = new FormControl(inputData.value || '', [
        ...inputData.validators,
        ...defaultValidators,
      ]);
    }

    return new FormGroup(group);
  }
}
