import { Directive, input, Renderer2, inject, effect, AfterViewInit } from '@angular/core';
import { IconPositionInfo } from './icon-position-info';

@Directive({
  selector: '[appItemWithIcon]',
  host: {
    class: 'item-with-icon',
  },
})
export class ItemWithIconDirective implements AfterViewInit {
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
  ngAfterViewInit() {
    if (this.icon()) {
      console.log('ngAfterViewInit', this.icon());
      this.renderer.addClass(this.icon(), `item-icon-${this.iconPosition()}`);
    }
  }
}
