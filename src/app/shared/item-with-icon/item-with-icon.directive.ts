import { Directive, input, Renderer2, OnInit, ElementRef, inject, effect } from '@angular/core';
import { IconPositionInfo } from './icon-position-info';

@Directive({
  selector: '[appItemWithIcon]',
  host: {
    class: 'item-with-icon',
  },
})
export class ItemWithIconDirective implements OnInit {
  iconPosition = input<IconPositionInfo>('left');
  activeIcon = input(false);

  private host = inject(ElementRef);
  private renderer = inject(Renderer2);
  private iconElement?: HTMLElement;

  constructor() {
    effect(() => this.setIconState());
  }

  ngOnInit() {
    this.iconElement = this.host.nativeElement.querySelector('mat-icon');
    this.addIconPositionClass();
  }

  addIconPositionClass() {
    if (this.iconElement) {
      this.renderer.addClass(this.iconElement, `item-icon-${this.iconPosition()}`);
    }
  }

  setIconState() {
    if (this.iconElement) {
      if (this.activeIcon()) {
        this.renderer.addClass(this.iconElement, 'item-icon-active');
      } else {
        this.renderer.removeClass(this.iconElement, 'item-icon-active');
      }
    }
  }
}
