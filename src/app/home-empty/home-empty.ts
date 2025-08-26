import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ERROR_MESSAGES } from '@shared/constants';
import { Entity } from '@shared/models';

@Component({
  selector: 'app-home-empty',
  imports: [],
  templateUrl: './home-empty.html',
  styleUrl: './home-empty.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeEmpty {
  entity = input.required<Entity>();

  createMessage = ERROR_MESSAGES.emptyHomeData.create;
  emptyMessage = computed(() => ERROR_MESSAGES.emptyHomeData[this.entity()]);
}
