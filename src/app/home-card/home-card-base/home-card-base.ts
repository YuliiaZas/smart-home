import { Directive, model, output } from '@angular/core';
import { SENSOR_TYPES_WITH_HIDDEN_AMOUNT } from '@shared/constants';
import { HomeItemInfo, HomeCardInfo } from '@shared/models';

@Directive({})
export abstract class HomeCardBase {
  data = model.required<HomeCardInfo>();
  updateCardData = output<HomeCardInfo>();

  protected readonly sensorTypesWithHiddenAmount = SENSOR_TYPES_WITH_HIDDEN_AMOUNT;

  changeDeviceState(device?: HomeItemInfo) {
    if (!device || !('state' in device)) return;

    this.data.update((currentData) => {
      const updatedItems = currentData.items.map((item) => {
        if (item.label === device.label) {
          return {
            ...item,
            state: !device.state,
          };
        }
        return item;
      });

      return {
        ...currentData,
        items: updatedItems,
      };
    });

    this.updateCardData.emit(this.data());
  }
}
