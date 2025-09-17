import { CardLayout } from '@shared/models';
import { HOME_ITEMS_NUMBER_FOR_LAYOUT } from '../home-items-number-for-layout';

export const LAYOUT_MESSAGES = {
  [CardLayout.HORIZONTAL]: 'Horizontal card layout',
  [CardLayout.VERTICAL]: `Vertical card layout: ${getItemsNumberMessage(CardLayout.VERTICAL)}`,
  [CardLayout.SINGLE]: `Single item card layout: ${getItemsNumberMessage(CardLayout.SINGLE)}`,
};

function getItemsNumberMessage(layout: CardLayout): string {
  const maxItems = HOME_ITEMS_NUMBER_FOR_LAYOUT[layout];
  if (!maxItems) return '';
  return maxItems === 1 ? 'only 1 device or sensor' : `up to ${maxItems} devices or sensors`;
}
