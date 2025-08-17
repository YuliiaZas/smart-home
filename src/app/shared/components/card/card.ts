import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
  imports: [
    NgClass,
    MatCard,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardTitle,
    MatCardContent,
    MatCardFooter,
    MatCardActions,
  ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  headerClass = input<string>('');
}
