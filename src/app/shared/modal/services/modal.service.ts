import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ModalDialog, ModalForm } from '../components';
import { ComponentWithForm, DialogData, FormDialogReference, FormModalData, ModalConfig } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  readonly dialog = inject(MatDialog);

  openDialog(modalConfig: ModalConfig<DialogData>): MatDialogRef<ModalDialog, boolean> {
    const dialogReference = this.dialog.open<ModalDialog, DialogData, boolean>(
      ModalDialog,
      this.#getDialogConfig(modalConfig)
    );

    return dialogReference;
  }

  openFormModal<TComponent extends ComponentWithForm>(
    modalConfig: ModalConfig<FormModalData<TComponent>>
  ): FormDialogReference<TComponent> {
    const dialogReference = this.dialog.open<ModalForm<TComponent>, FormModalData<TComponent>, boolean>(
      ModalForm,
      this.#getDialogConfig(modalConfig)
    );

    const customDialogReference = dialogReference as unknown as FormDialogReference<TComponent>;
    customDialogReference.onConfirm = () => dialogReference.componentInstance?.onConfirm$.asObservable();
    return customDialogReference;
  }

  #getDialogConfig(modalConfig: ModalConfig): MatDialogConfig {
    return {
      data: modalConfig.data,
      disableClose: modalConfig.disableClose ?? true,
      role: modalConfig.isAlertDialog ? 'alertdialog' : 'dialog',
      autoFocus: modalConfig.autoFocus ?? '#confirm',
      width: '80%',
      minWidth: '330px',
      restoreFocus: false,
    };
  }
}
