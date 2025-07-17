import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeCard } from './home-card/home-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeCard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'smart-home';
}
