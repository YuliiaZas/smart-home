import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MoverButtonStyle, MoverDirection, moverIcons, moverLabels } from './mover.constants';

@Component({
  selector: 'app-mover',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './mover.html',
  styleUrl: './mover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Mover {
  sortedIds = input.required<string[]>();
  currentId = input.required<string>();
  buttonsStyle = input<MoverButtonStyle>(MoverButtonStyle.DEFAULT);
  showNumberSelector = input<boolean>(true);

  setSorting = output<string[]>();

  selectOptions = computed(() => {
    const ids = this.sortedIds();
    return ids.map((_, index) => ({
      value: index,
      viewValue: index + 1,
    }));
  });

  currentIndex = computed(() => this.sortedIds().indexOf(this.currentId()));

  leftButton = computed(() => this.#getButton(MoverDirection.LEFT));
  rightButton = computed(() => this.#getButton(MoverDirection.RIGHT));
  isLeftButtonDisabled = computed(() => this.currentIndex() === 0);
  isRightButtonDisabled = computed(() => this.currentIndex() === this.sortedIds().length - 1);

  buttonClick(direction: MoverDirection) {
    if (direction === MoverDirection.LEFT && !this.isLeftButtonDisabled()) {
      this.#changeCurrentIndex(this.currentIndex() - 1);
    } else if (direction === MoverDirection.RIGHT && !this.isRightButtonDisabled()) {
      this.#changeCurrentIndex(this.currentIndex() + 1);
    }
  }

  selectValue(event: Event) {
    const index = Number((event.target as HTMLSelectElement).value);
    this.#changeCurrentIndex(index);
  }

  #changeCurrentIndex(newIndex: number) {
    const changedIds = this.#getChangedIds(newIndex);
    if (changedIds) {
      this.setSorting.emit(changedIds);
    }
  }

  #getButton(direction: MoverDirection) {
    return {
      id: direction,
      icon: moverIcons[this.buttonsStyle()][direction],
      label: moverLabels[direction],
    };
  }

  #getChangedIds(newIndex: number): string[] | null {
    const ids = [...this.sortedIds()];
    const currentIndex = this.currentIndex();
    if (newIndex < 0 || newIndex >= ids.length || currentIndex === newIndex) {
      return null;
    }
    const [movedItem] = ids.splice(currentIndex, 1);
    ids.splice(newIndex, 0, movedItem);
    return ids;
  }
}
