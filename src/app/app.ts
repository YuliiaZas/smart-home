import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardSortingService } from './shared/card-sorting.service';
import { SideNav } from './shared/layout/side-nav/side-nav';
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, SideNav],
  providers: [CardSortingService],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'smart-home';
  protected navItems = [
    { label: 'Overview', icon: 'dashboard', link: '/', active: true },
    { label: 'About', icon: 'info', link: '/about' },
  ];
}
