import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { TabInfo, TabItemInfo } from '@shared/models';
import { TabsFacade } from '@state';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatTabNav, MatTabLink, MatTabNavPanel],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  #tabsFacade = inject(TabsFacade);

  #dashboardTabs = toSignal<TabInfo[]>(this.#tabsFacade.tabsInfo$);

  tabs = computed<TabItemInfo[]>(() => {
    const tabs = this.#dashboardTabs();
    return (tabs || []).map((tab) => ({ ...tab, link: tab.id }));
  });
}
