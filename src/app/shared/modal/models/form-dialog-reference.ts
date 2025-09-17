import { MatDialogRef } from '@angular/material/dialog';
import { ComponentWithForm } from '@shared/models';
import { ModalFormFacade, ModalFormInterface } from './modal-form-interface';

export interface FormDialogReference<TFormValue, TComponent extends ComponentWithForm<TFormValue>>
  extends MatDialogRef<ModalFormInterface<TFormValue, TComponent>, boolean>,
    Omit<ModalFormFacade<TFormValue>, 'onConfirm$'> {
  onConfirm: () => ModalFormFacade<TFormValue>['onConfirm$'];
}
