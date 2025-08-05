import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { DeviceInfo, HomeItemInfo, SensorInfo } from '@shared/models';
import { AddTitleToLabelPipe, StateValuePipe, UnitsPipe } from '@shared/pipes';
import { Card } from '@shared/components';
import { HomeCardBase } from '../home-card-base/home-card-base';
import { HomeItemIcon } from '../../home-item-icon/home-item-icon';

@Component({
  selector: 'app-home-card-single',
  imports: [Card, StateValuePipe, UnitsPipe, AddTitleToLabelPipe, HomeItemIcon],
  templateUrl: './home-card-single.html',
  styleUrl: './home-card-single.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCardSingle extends HomeCardBase {
  headerClass = 'body-1';

  singleItem = computed<HomeItemInfo>(() => this.data().items[0]);
  singleDevice = computed<DeviceInfo | undefined>(() =>
    this.singleItem()?.type === 'device' ? (this.singleItem() as DeviceInfo) : undefined
  );
  singleSensor = computed<SensorInfo | undefined>(() =>
    this.singleItem()?.type === 'sensor' ? (this.singleItem() as SensorInfo) : undefined
  );
}
