import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentWithForm } from '@shared/models';
import { ModalDialog, ModalForm } from '../components';
import { DialogData, FormDialogReference, FormModalData, ModalConfig } from '../models';

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

  openFormModal<TFormValue, TComponent extends ComponentWithForm<TFormValue>>(
    modalConfig: ModalConfig<FormModalData<TFormValue, TComponent>>
  ): FormDialogReference<TFormValue, TComponent> {
    const dialogReference = this.dialog.open<
      ModalForm<TFormValue, TComponent>,
      FormModalData<TFormValue, TComponent>,
      boolean
    >(ModalForm, this.#getDialogConfig(modalConfig));

    const customDialogReference = dialogReference as unknown as FormDialogReference<TFormValue, TComponent>;
    customDialogReference.onConfirm = () => dialogReference.componentInstance?.onConfirm;
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
