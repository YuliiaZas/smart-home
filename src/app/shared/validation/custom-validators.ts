import { AbstractControl, ValidationErrors } from '@angular/forms';

type ConditionalObject = Record<string, number>;

export const CustomValidators = {
  uniqueWithinArray:
    (array: string[], initialValue?: string) =>
    (formControl: AbstractControl): ValidationErrors | null => {
      const value = formControl.value as string;
      if (array.includes(value) && (!initialValue || value !== initialValue)) {
        return { notUnique: true };
      }
      return null;
    },
  maxLengthConditional:
    (conditionalObject: ConditionalObject, key: keyof ConditionalObject) =>
    (formControl: AbstractControl): ValidationErrors | null => {
      const value = formControl.value as string[];
      if (!(key in conditionalObject)) {
        return null;
      }
      if (value.length > conditionalObject[key]) {
        return { maxLengthConditional: { requiredLength: conditionalObject[key], actualLength: value.length, key } };
      }
      return null;
    },
};
