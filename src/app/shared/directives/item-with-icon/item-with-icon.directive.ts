import { Directive, input, Renderer2, inject, effect } from '@angular/core';
import { IconPositionInfo } from './icon-position-info';

@Directive({
  selector: '[appItemWithIcon]',
  host: {
    class: 'item-with-icon',
  },
})
export class ItemWithIconDirective {
  icon = input.required<HTMLElement>({ alias: 'appItemWithIcon' });
  iconPosition = input<IconPositionInfo>('left');

  private renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      if (this.icon()) {
        this.renderer.addClass(this.icon(), `item-icon-${this.iconPosition()}`);
      }
    });
  }
}
