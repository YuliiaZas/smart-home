import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalForm } from '../components';
import { ComponentWithForm } from './component-with-form';

export interface FormDialogReference<TComponent extends ComponentWithForm>
  extends MatDialogRef<ModalForm<TComponent>, boolean> {
  onConfirm: () => Observable<FormGroup>;
}
