import {
  Component,
  inject,
  signal,
  input,
  OnInit,
  DestroyRef,
  computed,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDivider, MatList, MatListItemIcon, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem } from '@angular/material/list';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIcon } from '@angular/material/icon';
import { UserProfileInfo } from '@shared/auth';
import { NavInfo } from '@shared/models/nav-item-info';
import { SIDE_NAV_WIDTH, BREAKPOINT_MAX_WIDTH } from '@shared/constants';
import { SideNavButton } from '../side-nav-button/side-nav-button';
import { SideNavUser } from '../side-nav-user/side-nav-user';

@Component({
  selector: 'app-side-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatNavList,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatIcon,
    MatDivider,
    SideNavButton,
    SideNavUser,
  ],
  templateUrl: './side-nav.html',
  styleUrls: ['./side-nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNav implements OnInit {
  navItems = input.required<NavInfo[]>();
  user = input.required<UserProfileInfo | null>();
  addDashboard = output<void>();
  logout = output<void>();

  expanded = signal(true);

  sideNavWidth = computed(() => (this.expanded() ? this.widthExpanded : this.widthSmall));
  contentMargin = computed(() => (this.expanded() && !this.isTablet() ? this.widthExpanded : this.widthSmall));

  protected readonly isTablet = signal(false);
  protected readonly widthSmall = SIDE_NAV_WIDTH.small;
  protected readonly widthExpanded = SIDE_NAV_WIDTH.expanded;

  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.breakpointObserver
      .observe(BREAKPOINT_MAX_WIDTH.tablet)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.isTablet.set(state.matches);
        if (state.matches) this.expanded.set(false);
      });
  }

  toggleExpanded() {
    this.expanded.set(!this.expanded());
  }

  contentClick() {
    if (this.isTablet() && this.expanded()) {
      this.expanded.set(false);
    }
  }
}
