import { inject, Injectable, inputBinding, Signal } from '@angular/core';
import { filter, map, merge, Observable, take, tap } from 'rxjs';
import { EDIT_MESSAGES } from '@shared/constants';
import { BaseForm, InputBase } from '@shared/form';
import { FormDialogReference, ModalService } from '@shared/modal';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseEditFormService<TFormValue> {
  #modalService = inject(ModalService);

  abstract addNew(...arguments_: unknown[]): Observable<TFormValue | null>;
  abstract edit(entityInfo: TFormValue): Observable<TFormValue | null>;

  protected abstract createInputsData(entityInfo?: TFormValue): InputBase<TFormValue[keyof TFormValue]>[];

  protected getSubmittedValueFromCreatedForm({
    title,
    controlsInfo,
    initDataId,
    errorMessage,
    closeObservable,
  }: {
    title: string;
    controlsInfo: InputBase<TFormValue[keyof TFormValue]>[];
    initDataId?: string | ((data: TFormValue) => string);
    errorMessage?: Signal<string>;
    closeObservable?: Observable<void>;
  }): Observable<TFormValue | null> {
    const modalForm = this.#createModalForm({
      title,
      controlsInfo,
      errorMessage,
    });

    if (closeObservable) {
      closeObservable.pipe(take(1)).subscribe(() => modalForm.close(true));
    }

    const submit$ = modalForm.onConfirm().pipe(
      tap(() => {
        if (!closeObservable) modalForm.close(true);
      }),
      map((formData) => this.#addIdToFormValue(formData, initDataId))
    );

    return merge(submit$, this.#getFormCancelEvent(modalForm));
  }

  #createModalForm({
    controlsInfo,
    title,
    errorMessage,
  }: {
    title: string;
    controlsInfo: InputBase<TFormValue[keyof TFormValue]>[];
    errorMessage?: Signal<string>;
  }): FormDialogReference<TFormValue, BaseForm<TFormValue>> {
    return this.#modalService.openFormModal({
      data: {
        title: title,
        component: BaseForm<TFormValue>,
        componentBindings: [
          inputBinding('controlsInfo', () => controlsInfo),
          inputBinding('errorMessage', () => (errorMessage ? errorMessage() : '')),
        ],
        cancelButtonText: EDIT_MESSAGES.cancelButton,
        confirmButtonText: EDIT_MESSAGES.applyButton,
      },
    });
  }

  #getFormCancelEvent(modalForm: FormDialogReference<TFormValue, BaseForm<TFormValue>>): Observable<null> {
    return modalForm.afterClosed().pipe(
      filter((result) => result === false),
      map(() => null)
    );
  }

  #addIdToFormValue(formData: TFormValue, initDataId?: string | ((data: TFormValue) => string)): TFormValue {
    if (initDataId && formData && typeof formData === 'object' && !('id' in formData)) {
      const id = typeof initDataId === 'function' ? initDataId(formData) : initDataId;
      return { ...formData, id };
    }
    return formData;
  }
}
