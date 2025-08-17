import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { DeviceInfo, HomeItemInfo, SensorInfo } from '@shared/models';
import { AddTitleToLabelPipe, StateValuePipe, UnitsPipe } from '@shared/pipes';
import { Card } from '@shared/components';
import { HomeCardBase } from '../home-card-base/home-card-base';
import { HomeItemIcon } from '../../home-item-icon/home-item-icon';
import { isDeviceInfo, isSensorInfo } from '@shared/utils';

@Component({
  selector: 'app-home-card-single',
  imports: [Card, StateValuePipe, UnitsPipe, AddTitleToLabelPipe, HomeItemIcon],
  templateUrl: './home-card-single.html',
  styleUrl: './home-card-single.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCardSingle extends HomeCardBase {
  headerClass = 'body-1';

  singleItem = computed<HomeItemInfo>(() => this.cardData().items[0]);
  singleDevice = computed<DeviceInfo | undefined>(() => {
    const item = this.singleItem();
    return isDeviceInfo(item) ? item : undefined;
  });
  singleSensor = computed<SensorInfo | undefined>(() => {
    const item = this.singleItem();
    return isSensorInfo(item) ? item : undefined;
  });
}
