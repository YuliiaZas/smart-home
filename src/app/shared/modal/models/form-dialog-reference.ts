import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ComponentWithForm } from '@shared/models';
import { ModalForm } from '../components';

export interface FormDialogReference<TFormValue, TComponent extends ComponentWithForm<TFormValue>>
  extends MatDialogRef<ModalForm<TFormValue, TComponent>, boolean> {
  onConfirm: () => Observable<TFormValue>;
}
