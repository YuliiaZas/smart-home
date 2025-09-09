import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { DashboardsFacade } from '@state';
import { EDIT_MESSAGES } from '@shared/constants';
import { DialogData, ModalConfig, ModalService } from '@shared/modal';

export const unsavedChangesGuard: CanDeactivateFn<unknown> = () => {
  const dashboardsFacade = inject(DashboardsFacade);
  const modalService = inject(ModalService);
  const confirmationDialogConfig: ModalConfig<DialogData> = {
    data: {
      title: EDIT_MESSAGES.unsavedChanges,
      message: EDIT_MESSAGES.unsavedChangesMessage,
      confirmButtonText: EDIT_MESSAGES.discardButton,
      cancelButtonText: EDIT_MESSAGES.cancelButton,
    },
    isAlertDialog: true,
    autoFocus: 'dialog',
  };

  return dashboardsFacade.isChangedState$.pipe(
    switchMap((hasUnsavedChanges) =>
      hasUnsavedChanges ? modalService.openDialog(confirmationDialogConfig).afterClosed() : of(undefined)
    ),
    map((confirmed) => {
      if (confirmed === undefined) {
        dashboardsFacade.exitEditMode();
        return true;
      }

      if (confirmed) {
        dashboardsFacade.discardChanges();
      }
      return confirmed;
    })
  );
};
