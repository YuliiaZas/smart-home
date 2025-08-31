import { InputBase } from './input-base';
import { InputType } from '../models';

export class InputIcon extends InputBase<string> {
  override controlType = InputType.ICON;
}
