import { HomeItemInfo, SensorInfo } from '@shared/models';

export function isSensorInfo(item: HomeItemInfo | undefined): item is SensorInfo {
  return item?.type === 'sensor';
}
