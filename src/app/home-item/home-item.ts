import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ItemWithIconDirective, IconPositionInfo } from '@shared/directives';

@Component({
  selector: 'app-home-item',
  imports: [MatIcon, ItemWithIconDirective],
  templateUrl: './home-item.html',
  styleUrls: ['./home-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeItem {
  label = input.required<string>();
  icon = input.required<string>();
  showValue = input(false);
  clickableIcon = input(false);
  iconPosition = input<IconPositionInfo>('left');
  activeIcon = input(false);

  iconClick = output<void>();

  handleIconClick() {
    if (this.clickableIcon()) {
      this.iconClick.emit();
    }
  }
}
