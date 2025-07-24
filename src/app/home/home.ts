import { Component, input } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import * as mockData from '@shared/constants/mock-data.json';
import { HomeDashboard } from '../home-dashboard/home-dashboard';
import { HomeInfo } from './home-info';

@Component({
  selector: 'app-home',
  imports: [MatTab, MatTabGroup, HomeDashboard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  data = input<HomeInfo>(mockData as HomeInfo);
}
