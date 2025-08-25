import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListItemIcon } from '@angular/material/list';

@Component({
  selector: 'app-side-nav-button',
  imports: [NgClass, MatIconModule, MatListItemIcon, MatButtonModule],
  templateUrl: './side-nav-button.html',
  styleUrl: './side-nav-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavButton {
  showLabel = input<boolean>(true);
  label = input.required<string>();
  icon = input.required<string>();
  iconClass = input<string>('');
  labelClass = input<string>('');

  buttonClick = output<void>();
}
