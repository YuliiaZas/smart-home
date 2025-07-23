import { Component, inject, signal, input, OnInit, DestroyRef, computed } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem } from '@angular/material/list';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIcon } from '@angular/material/icon';
import { NavInfo } from '../../models/nav-item-info';
import { MenuButton } from '../menu-button/menu-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BREAKPOINT_MAX_WIDTH } from '../../constants/breakpoint';

@Component({
  selector: 'app-side-nav',
  imports: [MatSidenavContainer, MatSidenav, MatSidenavContent, MatNavList, MatListItem, MatIcon, MenuButton],
  templateUrl: './side-nav.html',
})
export class SideNav implements OnInit {
  navItems = input.required<NavInfo[]>();

  expanded = signal(true);

  sideNavWidth = computed(() => (this.expanded() ? this.widthBig : this.widthSmall));
  contentMargin = computed(() => (this.expanded() && !this.isTablet() ? this.widthBig : this.widthSmall));

  protected readonly isTablet = signal(false);
  protected readonly widthSmall = 65;
  protected readonly widthBig = 185;

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
