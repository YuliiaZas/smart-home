import { Directive, Renderer2, inject, effect, contentChild, ElementRef } from '@angular/core';
import { Mover } from './mover';

@Directive({
  selector: '[appMoverSurround]',
})
export class MoverSurroundDirective {
  mover = contentChild(Mover);
  #hostElement = inject(ElementRef).nativeElement;
  #renderer = inject(Renderer2);

  #hostClass = 'mover-surround-host';

  constructor() {
    effect(() => {
      const moverElement = this.mover()?.element;
      if (moverElement) {
        this.#renderer.addClass(this.#hostElement, this.#hostClass);
      } else {
        this.#renderer.removeClass(this.#hostElement, this.#hostClass);
      }
    });
  }
}
