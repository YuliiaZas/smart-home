import { InputBase } from './input-base';
import { InputType } from '../models';

export class InputSelect extends InputBase<string> {
  override controlType = InputType.SELECT;
}
