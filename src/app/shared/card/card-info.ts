import { CardLayout } from '../models/card-layout.enum';

export interface CardInfo {
  id: string;
  title: string;
  layout: CardLayout;
}
