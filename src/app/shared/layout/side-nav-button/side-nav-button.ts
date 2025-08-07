import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListItemIcon } from '@angular/material/list';

@Component({
  selector: 'app-side-nav-button',
  imports: [MatIcon, MatListItemIcon, MatButton],
  templateUrl: './side-nav-button.html',
  styleUrl: './side-nav-button.scss',
})
export class SideNavButton {
  showLabel = input<boolean>(true);
  label = input.required<string>();
  icon = input.required<string>();

  buttonClick = output<void>();
}
