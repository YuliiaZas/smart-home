import { Directive, model, output } from '@angular/core';
import { SENSOR_TYPES_WITH_HIDDEN_AMOUNT } from '@shared/constants';
import { HomeItemInfo, HomeCardInfo } from '@shared/models';

@Directive({})
export abstract class HomeCardBase {
  cardData = model.required<HomeCardInfo>();
  updateCardData = output<HomeCardInfo>();

  protected readonly sensorTypesWithHiddenAmount = SENSOR_TYPES_WITH_HIDDEN_AMOUNT;

  changeDeviceState(device?: HomeItemInfo) {
    if (!device || !('state' in device)) return;

    this.cardData.update((currentCardData) => {
      const updatedItems = currentCardData.items.map((item) =>
        item.label === device.label ? { ...item, state: !device.state } : item
      );

      return { ...currentCardData, items: updatedItems };
    });

    this.updateCardData.emit(this.cardData());
  }
}
