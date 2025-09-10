import { InputType } from './input-type';

export interface PasswordDataInfo {
  icon: string;
  title: string;
}

export interface PasswordDataMapInfo {
  [InputType.PASSWORD]: PasswordDataInfo;
  [InputType.TEXT]: PasswordDataInfo;
}
