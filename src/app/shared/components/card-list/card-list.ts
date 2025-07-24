import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-card-list',
  imports: [NgTemplateOutlet, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardList {
  sortingByGroups = input.required<string[][]>();
  cardTemplateRef = input.required<TemplateRef<{ cardId: string }>>();
  sortUpdated = output<string[][]>();

  dropListsIds = computed(() => this.sortingByGroups().map((_, index) => index.toString()));

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    const updatedGroups = {
      [event.previousContainer.id]: event.previousContainer.data,
      [event.container.id]: event.container.data,
    };

    this.sortUpdated.emit(this.sortingByGroups().map((group, id) => (id in updatedGroups ? updatedGroups[id] : group)));
  }
}
