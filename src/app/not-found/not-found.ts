import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTING_PATHS } from '@shared/constants';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  homePage = ROUTING_PATHS.HOME;
}
