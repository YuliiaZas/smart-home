import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { combineLatest, map, of, switchMap } from 'rxjs';
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

  return combineLatest([dashboardsFacade.isChangedState$, dashboardsFacade.isEditMode$]).pipe(
    switchMap(([hasUnsavedChanges, isEditMode]) => {
      if (!isEditMode) return of(true);
      if (!hasUnsavedChanges) {
        dashboardsFacade.exitEditMode();
        return of(true);
      }
      return modalService
        .openDialog(confirmationDialogConfig)
        .afterClosed()
        .pipe(
          map((confirmed) => {
            if (confirmed) {
              dashboardsFacade.discardChanges();
            }
            return confirmed ?? false;
          })
        );
    })
  );
};
