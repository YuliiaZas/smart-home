import { UnitsInfo } from '../units/units-info';
import { ItemWithIconInfo } from '../item-with-icon/item-with-icon-info';
import { CardLayout } from './card-layout.enum';

export interface CardInfo {
  id: string;
  title: string;
  layout: CardLayout;
}

export interface SensorInfo extends ItemWithIconInfo {
  type: 'sensor';
  value: UnitsInfo;
}

export interface DeviceInfo extends ItemWithIconInfo {
  type: 'device';
  state: boolean;
}

export type HomeItemInfo = SensorInfo | DeviceInfo;

export interface HomeCardInfo extends CardInfo {
  items: HomeItemInfo[];
}
