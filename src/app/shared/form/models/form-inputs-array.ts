import { InputBase } from './typed-inputs';

export type FormInputsArray<T, TOption = T[keyof T]> = {
  [K in keyof T]: InputBase<T[K], string, TOption> & { controlKey: K };
}[keyof T][];
