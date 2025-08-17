import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addTitleToLabel',
})
export class AddTitleToLabelPipe implements PipeTransform {
  transform(label: string, title?: string): string {
    return title ? `${title} - ${label}` : label;
  }
}
