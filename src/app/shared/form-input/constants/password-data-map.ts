import { InputType, PasswordDataMapInfo } from '../models';

export const passwordDataMap: PasswordDataMapInfo = {
  [InputType.PASSWORD]: {
    icon: 'visibility',
    title: 'Show password',
  },
  [InputType.TEXT]: {
    icon: 'visibility_off',
    title: 'Hide password',
  },
};
