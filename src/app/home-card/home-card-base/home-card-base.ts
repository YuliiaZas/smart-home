import { Directive, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Dictionary } from '@ngrx/entity';
import { SENSOR_TYPES_WITH_HIDDEN_AMOUNT } from '@shared/constants';
import { HomeCardWithItemsIdsInfo, HomeItemInfo } from '@shared/models';
import { HomeItemsFacade } from '@state';

@Directive({})
export abstract class HomeCardBase {
  protected homeItemsFacade = inject(HomeItemsFacade);

  homeItemsEntities = toSignal(this.homeItemsFacade.itemsEntities$, { initialValue: {} as Dictionary<HomeItemInfo> });

  cardData = input.required<HomeCardWithItemsIdsInfo>();

  protected readonly sensorTypesWithHiddenAmount = SENSOR_TYPES_WITH_HIDDEN_AMOUNT;

  changeDeviceState(device: HomeItemInfo) {
    if (!device || !('state' in device)) return;

    this.homeItemsFacade.setDeviceState(device.id, !device.state);
  }
}
