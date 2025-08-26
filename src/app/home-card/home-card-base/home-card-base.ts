import { Directive, inject, model, output } from '@angular/core';
import { SENSOR_TYPES_WITH_HIDDEN_AMOUNT } from '@shared/constants';
import { HomeItemInfo, HomeCardInfo } from '@shared/models';
import { HomeCardService } from '../home-card.service';

@Directive({})
export abstract class HomeCardBase {
  cardData = model.required<HomeCardInfo>();
  updateCardData = output<HomeCardInfo>();

  cardService = inject(HomeCardService);

  protected readonly sensorTypesWithHiddenAmount = SENSOR_TYPES_WITH_HIDDEN_AMOUNT;

  changeDeviceState(device?: HomeItemInfo) {
    const updatedCardState = this.cardService.getUpdatedCardDataOnDeviceStateChange(this.cardData(), device);

    if (updatedCardState) {
      this.cardData.update(() => updatedCardState);
      this.updateCardData.emit(updatedCardState);
    }
  }
}
