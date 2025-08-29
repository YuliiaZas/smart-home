import { CustomModalData, DialogData, FormModalData } from './modal-config-data';

export interface ModalConfig<T = DialogData | CustomModalData | FormModalData> {
  data: T;
  disableClose?: boolean;
  isAlertDialog?: boolean;
  autoFocus?: 'dialog' | '#confirm' | '#cancel';
}
