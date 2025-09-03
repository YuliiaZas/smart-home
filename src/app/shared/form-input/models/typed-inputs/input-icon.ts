import { InputBase } from './input-base';
import { InputType } from '..';

export class InputIcon extends InputBase<string> {
  override controlType = InputType.ICON;
}
