import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-menu-button',
  imports: [MatIcon, MatButton],
  templateUrl: './menu-button.html',
  styleUrl: './menu-button.scss',
})
export class MenuButton {
  showLabel = input<boolean>(true);
  toggleMenu = output<void>();
}
