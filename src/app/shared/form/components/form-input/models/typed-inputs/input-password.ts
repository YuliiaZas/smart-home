import { InputBase } from './input-base';
import { InputType } from '..';

export class InputPassword extends InputBase<string> {
  override controlType = InputType.PASSWORD;
}
