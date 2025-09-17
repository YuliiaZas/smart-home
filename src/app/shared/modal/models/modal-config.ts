import { ComponentWithForm } from '@shared/models';
import { CustomModalData, DialogData, FormModalData } from './modal-config-data';

export interface ModalConfig<T = DialogData | CustomModalData | FormModalData<object, ComponentWithForm<object>>> {
  data: T;
  disableClose?: boolean;
  isAlertDialog?: boolean;
  autoFocus?: 'dialog' | '#confirm' | '#cancel';
}
