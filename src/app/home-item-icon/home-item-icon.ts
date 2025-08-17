import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { StateIconDirective } from '@shared/directives';

@Component({
  selector: 'app-home-item-icon',
  imports: [MatIcon, StateIconDirective],
  templateUrl: './home-item-icon.html',
  styleUrls: ['./home-item-icon.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeItemIcon {
  icon = input.required<string>();
  clickableIcon = input(false);
  activeIcon = input(false);
  iconLabel = input('Toggle state');

  iconClick = output<void>();
}
