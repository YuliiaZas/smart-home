import { Directive, HostBinding, input } from '@angular/core';

@Directive({
  selector: '[appItemWithIcon]',
})
export class ItemWithIconDirective {
  iconPosition = input<'left' | 'right'>('left');
  activeIcon = input(false);

  @HostBinding('class.item-icon-left')
  get isIconLeft() {
    return this.iconPosition() === 'left';
  }

  @HostBinding('class.item-icon-right')
  get isIconRight() {
    return this.iconPosition() === 'right';
  }

  @HostBinding('class.item-icon-active')
  get isIconActive() {
    return this.activeIcon();
  }
}
