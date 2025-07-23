import { Component, input } from '@angular/core';
import * as mockData from '../shared/constants/mock-data.json';
import { HomeInfo } from './home-info';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { HomeDashboard } from '../home-dashboard/home-dashboard';

@Component({
  selector: 'app-home',
  imports: [MatTab, MatTabGroup, HomeDashboard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  data = input<HomeInfo>(mockData as HomeInfo);
}
