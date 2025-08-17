import { ItemWithIconInfo } from './home-item-info';

export interface NavInfo extends ItemWithIconInfo {
  link: string;
  active?: boolean;
}
