import { HomeCardInfo } from './home-card-info';

export interface DashboardTabInfo {
  id: string;
  title: string;
  cards: HomeCardInfo[];
}
