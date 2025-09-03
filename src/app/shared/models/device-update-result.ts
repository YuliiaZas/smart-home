import { DeviceInfo } from './home-item-info';

export interface DeviceUpdateResult {
  success: DeviceInfo[];
  failedIds: string[];
  error: Error | null;
}
