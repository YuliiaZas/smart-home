import { UnitsInfo } from '../pipes/units-pipe/units-info';

export interface ItemWithIconInfo {
  id?: string;
  icon: string;
  label: string;
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
