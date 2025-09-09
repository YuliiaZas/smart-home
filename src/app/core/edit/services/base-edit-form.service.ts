import { inject, Injectable, inputBinding, Signal } from '@angular/core';
import { filter, map, merge, Observable, take, tap } from 'rxjs';
import { EDIT_MESSAGES } from '@shared/constants';
import { InputBase } from '@shared/form-input';
import { FormDialogReference, ModalService } from '@shared/modal';
import { EditInfoForm } from '../components';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseEditFormService<T extends object> {
  #modalService = inject(ModalService);

  abstract addNew(...arguments_: unknown[]): Observable<T | null>;
  abstract edit(entityInfo: T): Observable<T | null>;

  protected abstract createInputsData(entityInfo?: T): InputBase<string>[];

  protected getSubmittedValueFromCreatedForm({
    title,
    controlsInfo,
    initDataId,
    errorMessage,
    closeObservable,
  }: {
    title: string;
    controlsInfo: InputBase<string>[];
    initDataId?: string | ((data: T) => string);
    errorMessage?: Signal<string>;
    closeObservable?: Observable<void>;
  }): Observable<T | null> {
    const modalForm = this.#createModalForm({
      title,
      controlsInfo,
      errorMessage,
    });

    if (closeObservable) {
      closeObservable.pipe(take(1)).subscribe(() => modalForm.close(true));
    }

    const submit$ = this.#getFormSubmitValue<T>(modalForm).pipe(
      tap(() => {
        if (!closeObservable) modalForm.close(true);
      }),
      map((formData: T) => this.#addIdToFormValue(formData, initDataId))
    );

    return merge(submit$, this.#getFormCancelEvent(modalForm));
  }

  #createModalForm({
    controlsInfo,
    title,
    errorMessage,
  }: {
    title: string;
    controlsInfo: InputBase<string>[];
    errorMessage?: Signal<string>;
  }): FormDialogReference<EditInfoForm> {
    return this.#modalService.openFormModal({
      data: {
        title: title,
        component: EditInfoForm,
        componentBindings: [
          inputBinding('controlsInfo', () => controlsInfo),
          inputBinding('errorMessage', () => (errorMessage ? errorMessage() : '')),
        ],
        cancelButtonText: EDIT_MESSAGES.cancelButton,
        confirmButtonText: EDIT_MESSAGES.applyButton,
      },
    });
  }

  #getFormSubmitValue<T>(modalForm: FormDialogReference<EditInfoForm>): Observable<T> {
    return modalForm.onConfirm().pipe(
      tap((form) => {
        form.markAllAsTouched();
        form.updateValueAndValidity();
      }),
      filter((form) => form.valid),
      map((form) => form.getRawValue() as T)
    );
  }

  #getFormCancelEvent(modalForm: FormDialogReference<EditInfoForm>): Observable<null> {
    return modalForm.afterClosed().pipe(
      filter((result) => result === false),
      map(() => null)
    );
  }

  #addIdToFormValue(formData: T, initDataId?: string | ((data: T) => string)) {
    if (!('id' in formData) && initDataId) {
      const id = typeof initDataId === 'function' ? initDataId(formData) : initDataId;
      return { ...formData, id };
    }
    return formData;
  }
}
