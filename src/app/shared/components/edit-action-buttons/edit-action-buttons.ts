import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output, DestroyRef, input, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EDIT_MESSAGES } from '@shared/constants';
import { DialogData, ModalService } from '@shared/modal';
import { Entity } from '@shared/models';

@Component({
  selector: 'app-edit-action-buttons',
  imports: [NgClass, MatButtonModule, MatIconModule],
  templateUrl: './edit-action-buttons.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditActionButtons {
  #destroyRef = inject(DestroyRef);
  #modalService = inject(ModalService);
  #editMessages = EDIT_MESSAGES;

  entity = input.required<Entity>();
  entityName = input<string>();
  showEditButton = input<boolean>(true);
  showDeleteButton = input<boolean>(true);
  renameMode = input<boolean>(false);
  editClass = input<string>('');
  deleteClass = input<string>('danger');

  editEvent = output<void>();
  deleteEvent = output<void>();

  editButtonLabel = computed(() => {
    const entity = this.entity();
    const entityName = this.entityName();
    if (this.renameMode()) {
      return this.#editMessages.renameEntity(entity, entityName);
    }
    return this.#editMessages.editEntity(entity, entityName);
  });
  deleteButtonLabel = computed(() => this.#editMessages.deleteEntity(this.entity(), this.entityName()));

  #getDeleteConfirmationModalText = computed<DialogData>(() => {
    const { title, message } = this.#editMessages.deleteConfirmation(this.entity(), this.entityName());
    return {
      title,
      message,
      confirmButtonText: this.#editMessages.deleteButton,
      cancelButtonText: this.#editMessages.cancelButton,
    };
  });

  handleDelete() {
    const confirmationModal = this.#modalService.openDialog({
      data: this.#getDeleteConfirmationModalText(),
      isAlertDialog: true,
      autoFocus: 'dialog',
    });

    confirmationModal
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter((result) => result === true)
      )
      .subscribe(() => this.deleteEvent.emit());
  }
}
