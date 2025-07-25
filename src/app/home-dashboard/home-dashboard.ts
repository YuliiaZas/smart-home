import { ChangeDetectionStrategy, Component, inject, computed, input, signal, OnChanges } from '@angular/core';
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
export class HomeDashboard implements OnChanges {
  data = input.required<DashboardInfo>();

  protected cards = computed(() => {
    const accumulator: Record<string, HomeCardInfo> = {};
    for (const card of this.data().cards) {
      accumulator[card.id] = card;
    }
    return accumulator;
  });

  protected sorting = signal<string[]>([]);

  private cardSortingService = inject(CardSortingService);

  ngOnChanges() {
    this.sorting.set(
      this.cardSortingService.getCardsSorting(
        this.data().id,
        this.data().cards.map((card) => card.id)
      )
    );
  }

  sortUpdated(sorting: string[]) {
    this.sorting.set(sorting);

    this.cardSortingService.setCardsSorting(this.data().id, sorting);
  }
}
