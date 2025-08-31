import { InputBase } from './input-base';
import { InputType } from '../models';

export class InputText extends InputBase<string> {
  override controlType = InputType.TEXT;
}
