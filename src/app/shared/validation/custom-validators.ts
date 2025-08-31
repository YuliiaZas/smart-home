import { AbstractControl, ValidationErrors } from '@angular/forms';

export const CustomValidators = {
  uniqueWithinArray:
    (array: string[]) =>
    (formControl: AbstractControl): ValidationErrors | null => {
      const value = formControl.value as string;
      if (array.includes(value)) {
        return { notUnique: true };
      }
      return null;
    },
};
