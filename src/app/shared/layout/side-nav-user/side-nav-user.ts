import { Component, input } from '@angular/core';
import { UserProfileInfo } from '@shared/auth';

@Component({
  selector: 'app-side-nav-user',
  imports: [],
  templateUrl: './side-nav-user.html',
  styleUrl: './side-nav-user.scss',
})
export class SideNavUser {
  showLabel = input<boolean>(true);
  user = input.required<UserProfileInfo>();
}
