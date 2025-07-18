import { Component, input } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitleGroup,
  MatCardTitle,
  MatCardFooter,
  MatCardActions,
} from '@angular/material/card';

@Component({
  selector: 'app-card',
  imports: [MatCard, MatCardHeader, MatCardTitleGroup, MatCardTitle, MatCardContent, MatCardFooter, MatCardActions],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  title = input<string>('');
  hideTitle = input(false);
  isContentVertical = input(false);
}
