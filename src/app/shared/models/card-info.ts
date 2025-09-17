import { EntityInfo } from './entity-info';
import { CardLayout } from './enums';

export interface CardInfo extends EntityInfo {
  layout: CardLayout;
}
