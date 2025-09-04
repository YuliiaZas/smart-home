import { Binding, Type } from '@angular/core';
import { ComponentWithForm } from './component-with-form';

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

export interface FormModalData<TFormComponent extends ComponentWithForm = ComponentWithForm>
  extends CustomModalData<TFormComponent> {
  component: Type<TFormComponent>;
}
