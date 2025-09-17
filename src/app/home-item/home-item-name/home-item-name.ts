import { ChangeDetectionStrategy, Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { ItemWithIconDirective, IconPositionInfo } from '@shared/directives';
import { HomeItemIcon } from '../home-item-icon/home-item-icon';
@Component({
  selector: 'app-home-item-name',
  imports: [ItemWithIconDirective, HomeItemIcon],
  templateUrl: './home-item-name.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeItemName {
  label = input.required<string>();
  icon = input.required<string>();
  clickableIcon = input(false);
  iconPosition = input<IconPositionInfo>('left');
  activeIcon = input(false);

  iconClick = output<void>();

  @ViewChild('iconEl', { read: ElementRef, static: true }) iconRef!: ElementRef<HTMLElement>;

  handleIconClick() {
    if (this.clickableIcon()) {
      this.iconClick.emit();
    }
  }
}
