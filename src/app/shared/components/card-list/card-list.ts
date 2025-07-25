import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-card-list',
  imports: [NgTemplateOutlet, CdkDropList, CdkDrag],
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardList {
  sorting = input.required<string[]>();
  cardTemplateRef = input.required<TemplateRef<{ cardId: string }>>();
  sortUpdated = output<string[]>();

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sorting(), event.previousIndex, event.currentIndex);

    this.sortUpdated.emit(this.sorting());
  }
}
