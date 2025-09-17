import { Binding, Type } from '@angular/core';
import { ComponentWithForm } from '@shared/models';

interface ModalConfigData {
  title: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  focusConfirmButton?: boolean;
  confirmButtonColor?: string;
}

export interface DialogData extends ModalConfigData {
  message: string;
}

export interface CustomModalData<TComponent = unknown> extends ModalConfigData {
  component: Type<TComponent>;
  componentBindings?: Binding[];
  confirmButtonText: string;
}

export interface FormModalData<TFormValue, TFormComponent extends ComponentWithForm<TFormValue>>
  extends CustomModalData<TFormComponent> {
  component: Type<TFormComponent>;
}
