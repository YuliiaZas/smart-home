import { Directive, inject, input, TemplateRef, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Dictionary } from '@ngrx/entity';
import { SENSOR_TYPES_WITH_HIDDEN_AMOUNT } from '@shared/constants';
import { DeviceInfo, HomeCardWithItemsIdsInfo, HomeItemInfo } from '@shared/models';
import { HomeItemsFacade } from '@state';

@Directive({})
export abstract class HomeCardBase {
  protected homeItemsFacade = inject(HomeItemsFacade);
  protected readonly sensorTypesWithHiddenAmount = SENSOR_TYPES_WITH_HIDDEN_AMOUNT;

  cardData = input.required<HomeCardWithItemsIdsInfo>();

  cardTitleTemplate = viewChild.required('cardTitleTemplate', { read: TemplateRef });
  cardActionTemplate = viewChild.required('cardActionTemplate', { read: TemplateRef });

  homeItemsEntities = toSignal(this.homeItemsFacade.itemsEntities$, { initialValue: {} as Dictionary<HomeItemInfo> });

  changeDeviceState(device: DeviceInfo) {
    this.homeItemsFacade.setDeviceState(device.id, !device.state);
  }
}
