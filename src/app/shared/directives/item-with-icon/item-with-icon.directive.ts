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
  clickableIcon = input(false);
  activeIcon = input(false);

  private host = inject(ElementRef);
  private renderer = inject(Renderer2);
  private iconElement?: HTMLElement;

  constructor() {
    effect(() => this.setIconState());
  }

  ngOnInit() {
    this.iconElement = this.host.nativeElement.querySelector('mat-icon');
    if (this.iconElement) {
      this.addIconPositionClass();
      this.addIconClicableClass();
    }
  }

  addIconPositionClass() {
    this.renderer.addClass(this.iconElement, `item-icon-${this.iconPosition()}`);
  }

  addIconClicableClass() {
    if (this.clickableIcon()) this.renderer.addClass(this.iconElement, `cursor-pointer`);
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
