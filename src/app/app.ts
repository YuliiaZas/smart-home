import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardSortingService } from './shared/card-sorting.service';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeDashboardComponent],
  providers: [CardSortingService],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'smart-home';
}
