import { Component, computed, input } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitleGroup,
  MatCardTitle,
  MatCardFooter,
  MatCardActions,
} from '@angular/material/card';
import { CardInfo } from './card-info';
import { CardLayout } from '../models/card-layout.enum';

@Component({
  selector: 'app-card',
  imports: [MatCard, MatCardHeader, MatCardTitleGroup, MatCardTitle, MatCardContent, MatCardFooter, MatCardActions],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  data = input.required<CardInfo>();

  isVertical = computed(() => this.data().layout === CardLayout.VERTICAL);
}
