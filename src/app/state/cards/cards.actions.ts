import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CardInfo, DashboardTabInfo, HomeCardWithItemsIdsInfo } from '@shared/models';

export const cardsActions = createActionGroup({
  source: 'Cards',
  events: {
    'Set Cards Data': props<{ tabs: DashboardTabInfo[] }>(),

    'Enter Edit Mode': emptyProps(),
    'Exit Edit Mode': emptyProps(),
    'Discard Changes': emptyProps(),

    'Enter Card Edit Mode': props<{ cardId: string }>(),

    'Discard Current Card Changes': emptyProps(),

    'Change Current Card': props<{ cardData: Omit<HomeCardWithItemsIdsInfo, 'layout'> }>(),

    'Reorder Cards': props<{ tabId: string; cardsIdsOrdered: string[] }>(),

    'Add Card': props<{ tabId: string; cardInfo: Pick<CardInfo, 'id' | 'layout'> }>(),

    'Delete Card': props<{ tabId: string; cardId: string }>(),
  },
});
