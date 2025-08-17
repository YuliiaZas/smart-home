import { HomeCardInfo } from './home-card-info';

export interface DashboardInfo {
  id: string;
  title: string;
  cards: HomeCardInfo[];
}
