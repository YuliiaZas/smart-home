import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { TabInfo, TabItemInfo } from '@shared/models';
import { UserDashboards } from '@shared/dashboards/services';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatTabNav, MatTabLink, MatTabNavPanel],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private dashboardsService = inject(UserDashboards);

  dashboardTabs = toSignal<TabInfo[]>(this.dashboardsService.currentDashboardTabs$);

  tabs = computed<TabItemInfo[]>(() => {
    const tabs = this.dashboardTabs();
    return (tabs || []).map((tab) => ({ ...tab, link: tab.id }));
  });
}
