import { Pipe, type PipeTransform } from '@angular/core';
import { UnitsInfo } from './units-info';

@Pipe({
  name: 'appUnits',
})
export class UnitsPipe implements PipeTransform {
  transform(valueData: UnitsInfo): string {
    const { amount, unit } = valueData;
    if (!unit) {
      return typeof amount === 'string' ? amount : amount ? 'Detected' : 'Undetected';
    }

    return `${amount} ${unit}`;
  }
}
