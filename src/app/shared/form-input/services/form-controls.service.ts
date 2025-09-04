import { Injectable } from '@angular/core';
import { InputBase } from '../models/typed-inputs/input-base';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormControlsService {
  toFormGroup(inputsData: InputBase<string>[]) {
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
