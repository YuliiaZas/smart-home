import { Pipe, type PipeTransform } from '@angular/core';
import { UnitsInfo } from './units-info';

@Pipe({
  name: 'appUnits',
})
export class UnitsPipe implements PipeTransform {
  transform(value: UnitsInfo, type?: string, typesWithHiddenAmmount: string[] = []): string {
    const valueWithUnit = `${value.amount} ${value.unit}`;

    if (!type || typesWithHiddenAmmount.length === 0) {
      return valueWithUnit;
    }

    const isAmountHidden = typesWithHiddenAmmount.includes(type);
    return isAmountHidden ? value.unit : valueWithUnit;
  }
}
