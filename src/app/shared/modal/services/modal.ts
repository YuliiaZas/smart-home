import { Binding, Component, inject, Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { ModalCustom } from '../components/modal-custom/modal-custom';
import { ModalDialog } from '../components/modal-dialog/modal-dialog';

interface ModalData {
  title: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  focusConfirmButton?: boolean;
  confirmButtonColor?: string;
}
export interface DialogData extends ModalData {
  message: string;
}
export interface CustomModalData extends ModalData {
  component: Type<Component>;
  bindings?: Binding[];
  // directives?: Type<unknown>[] | undefined;
}
export interface ModalConfig<T = DialogData | CustomModalData> {
  data: T;
  disableClose?: boolean;
  isAlertDialog?: boolean;
  autoFocus?: 'dialog' | '#confirm' | '#cancel';
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  readonly dialog = inject(MatDialog);

  openDialog(modalConfig: ModalConfig<DialogData>): MatDialogRef<ModalDialog, boolean> {
    const dialogReference = this.dialog.open<ModalDialog, DialogData, boolean>(ModalDialog, {
      data: modalConfig.data,
      disableClose: modalConfig.disableClose ?? true,
      role: modalConfig.isAlertDialog ? 'alertdialog' : 'dialog',
      autoFocus: modalConfig.autoFocus ?? '#confirm',
    });

    return dialogReference;
  }

  // openCustomModal(modalConfig: ModalConfig<CustomModalData>): MatDialogRef<ModalCustom, boolean> {
  //   const dialogReference = this.dialog.open<ModalCustom, CustomModalData, boolean>(ModalCustom, {
  //     data: modalConfig.data,
  //     disableClose: modalConfig.disableClose ?? true,
  //     role: modalConfig.isAlertDialog ? 'alertdialog' : 'dialog',
  //     autoFocus: modalConfig.autoFocus ?? '#confirm',
  //   });

  //   return dialogReference;
  // }
}
