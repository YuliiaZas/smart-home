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
    // 'Save Current Card Changes': emptyProps(),
    'Discard Current Card Changes': emptyProps(),

    'Change Current Card': props<{ cardData: Omit<HomeCardWithItemsIdsInfo, 'layout'> }>(),
    // 'Rename Current Card': props<{ title: string }>(),

    // 'Add Item To Current Card': props<{ itemId: string }>(),
    // 'Remove Item From Current Card': props<{ orderIndex: number }>(), // itemId can be non-unique in a card

    'Reorder Cards': props<{ tabId: string; cardsIdsOrdered: string[] }>(),

    'Add Card': props<{ tabId: string; cardInfo: Pick<CardInfo, 'id' | 'layout'> }>(),

    'Delete Card': props<{ tabId: string; cardId: string }>(),
  },
});
