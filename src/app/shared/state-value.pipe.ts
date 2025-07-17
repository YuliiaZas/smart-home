import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appStateValue',
})
export class StateValuePipe implements PipeTransform {
  transform(value?: boolean): string {
    if (value === undefined || value === null) {
      return 'Unknown';
    }
    return value ? 'On' : 'Off';
  }
}
