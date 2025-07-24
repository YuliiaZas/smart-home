import { ChangeDetectionStrategy, Component, inject, computed, input } from '@angular/core';
import { CardList } from '@shared/components';
import { DashboardInfo, HomeCardInfo } from '@shared/models';
import { CardSortingService } from '@shared/services';
import { HomeCard } from '../home-card/home-card';

@Component({
  selector: 'app-home-dashboard',
  imports: [CardList, HomeCard],
  templateUrl: './home-dashboard.html',
  styleUrl: './home-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeDashboard {
  data = input.required<DashboardInfo>();

  protected sortingByGroups = computed(() =>
    this.cardSortingService.getCardsSorting(
      this.data().id,
      this.data().cards.map((card) => card.id)
    )
  );

  protected cards = computed(() => {
    const accumulator: Record<string, HomeCardInfo> = {};
    for (const card of this.data().cards) {
      accumulator[card.id] = card;
    }
    return accumulator;
  });

  private cardSortingService = inject(CardSortingService);

  sortUpdated(sorting: string[][]) {
    this.cardSortingService.setCardsSorting(this.data().id, sorting);
  }
}
