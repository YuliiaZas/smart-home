import { DeviceInfo, HomeItemInfo } from '@shared/models';

export function isDeviceInfo(item: HomeItemInfo | undefined): item is DeviceInfo {
  return item?.type === 'device';
}
