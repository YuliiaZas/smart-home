import { ComponentRef } from '@angular/core';
import { ComponentWithForm } from '@shared/models';
import { Observable } from 'rxjs';

export interface ModalFormFacade<TFormValue> {
  onConfirm$: Observable<TFormValue>;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

export interface ModalFormInterface<TFormValue, TComponent extends ComponentWithForm<TFormValue>>
  extends ModalFormFacade<TFormValue> {
  dynamicComponent?: ComponentRef<TComponent>;
}
