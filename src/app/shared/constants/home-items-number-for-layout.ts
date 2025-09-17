import { CardLayout } from '@shared/models';

export const HOME_ITEMS_NUMBER_FOR_LAYOUT: Partial<Record<CardLayout, number>> = {
  [CardLayout.SINGLE]: 1,
  [CardLayout.VERTICAL]: 4,
};
