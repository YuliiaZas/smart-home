import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appStateIcon]',
  host: {
    class: 'state-icon',
  },
})
export class StateIconDirective {
  @HostBinding('class.state-icon-active')
  @Input()
  activeIcon = false;
}
