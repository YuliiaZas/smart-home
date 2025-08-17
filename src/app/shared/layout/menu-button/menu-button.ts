import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListItemIcon } from '@angular/material/list';

@Component({
  selector: 'app-menu-button',
  imports: [MatIcon, MatListItemIcon, MatButton],
  templateUrl: './menu-button.html',
  styleUrl: './menu-button.scss',
})
export class MenuButton {
  showLabel = input<boolean>(true);
  toggleMenu = output<void>();
}
