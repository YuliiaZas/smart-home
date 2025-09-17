import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-card-list',
  imports: [NgTemplateOutlet],
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardList {
  cardIds = input.required<string[]>();
  cardTemplateRef = input.required<TemplateRef<{ cardId: string }>>();
}
