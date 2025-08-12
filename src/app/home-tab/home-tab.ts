import { ChangeDetectionStrategy, Component, inject, computed, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CardList } from '@shared/components';
import { HomeCardInfo } from '@shared/models';
import { CardSortingService } from '@shared/services';
import { UserDashboards } from '@shared/dashboards/services';
import { HomeCard } from '../home-card/home-card';

@Component({
  selector: 'app-home-tab',
  imports: [CardList, HomeCard],
  templateUrl: './home-tab.html',
  styleUrl: './home-tab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTab {
  private activatedRoute = inject(ActivatedRoute);
  private dashboardsService = inject(UserDashboards);
  private cardSortingService = inject(CardSortingService);

  parentParameters = toSignal(this.activatedRoute.parent?.paramMap || of(null));
  parameters = toSignal(this.activatedRoute.paramMap);
  dashboardId = computed(() => this.parentParameters()?.get('dashboardId'));
  tabId = computed(() => this.parameters()?.get('tabId'));
  sortingId = computed(() => `${this.dashboardId()}-${this.tabId()}`);

  dashboardData = toSignal(this.dashboardsService.currentDashboardData$);
  tabData = computed(() => {
    const tabId = this.tabId() || '';
    return (this.dashboardData() || {})[tabId] || { id: tabId, cards: [] };
  });

  protected cards = computed(() => {
    const accumulator: Record<string, HomeCardInfo> = {};
    for (const card of this.tabData().cards) {
      accumulator[card.id] = card;
    }
    return accumulator;
  });

  protected sorting = signal<string[][]>([]);

  constructor() {
    effect(() => {
      this.sorting.set(
        this.cardSortingService.getCardsSorting(
          this.tabData().id,
          this.tabData().cards.map((card) => card.id)
        )
      );
    });
  }

  sortUpdated(sorting: string[][]) {
    this.sorting.set(sorting);

    this.cardSortingService.setCardsSorting(this.tabData().id, sorting);
  }

  updateCardData(card: HomeCardInfo) {
    //TODO: Implement the logic to update the card data on the server.
    console.log('updateCardData', card);
  }
}
