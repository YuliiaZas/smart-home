import { inject, Injectable, inputBinding } from '@angular/core';
import { EMPTY, filter, map, merge, Observable, of, race, switchMap, take, tap } from 'rxjs';
import { EDIT_MESSAGES } from '@shared/constants';
import { FormDialogReference, ModalService } from '@shared/modal';
import { BaseForm, InputBase } from '@shared/form';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseEditFormService<TFormValue> {
  #modalService = inject(ModalService);

  abstract addNew(...arguments_: unknown[]): Observable<void>;
  abstract edit(entityInfo: TFormValue): Observable<void>;

  protected abstract createInputsData(entityInfo?: TFormValue): InputBase<TFormValue[keyof TFormValue]>[];

  // formDialog
  protected getSubmittedValueFromCreatedForm({
    title,
    controlsInfo,
    initDataId,
    submitHandler,
    cancelHandler,
    successObservable,
    errorObservable,
  }: {
    title: string;
    controlsInfo: InputBase<TFormValue[keyof TFormValue]>[];
    initDataId?: string | ((data: TFormValue) => string);
    submitHandler: (formValue: TFormValue) => void;
    cancelHandler?: () => void;
    successObservable?: Observable<void>;
    errorObservable?: Observable<string | null>;
  }): Observable<void> {
    const modalForm = this.#createModalForm({
      title,
      controlsInfo,
    });

    let isSubmitting = false;

    const submit$ = modalForm.onConfirm().pipe(
      filter(() => !isSubmitting),
      tap(() => (isSubmitting = true)),
      map((formValue) => this.#addIdToFormValue(formValue, initDataId)),
      switchMap((formData) => {
        submitHandler(formData);

        if (!successObservable && !errorObservable) {
          modalForm.close();
          return of(void 0);
        }

        modalForm.setLoading(true);

        return race([
          successObservable!.pipe(
            take(1),
            tap(() => {
              isSubmitting = false;
              modalForm.close();
              modalForm.setLoading(false);
            })
          ),
          errorObservable!.pipe(
            filter((error) => error !== null),
            take(1),
            tap((errorMessage) => {
              isSubmitting = false;
              modalForm.setLoading(false);
              modalForm.setError(errorMessage);
            }),
            switchMap(() => EMPTY)
          ),
        ]);
      })
    );

    const cancel$ = modalForm.afterClosed().pipe(
      filter((result) => result === false),
      tap(() => {
        if (cancelHandler) {
          cancelHandler();
        }
      }),
      map(() => void 0)
    );

    return merge(submit$, cancel$).pipe(take(1));
  }

  #createModalForm({
    controlsInfo,
    title,
  }: {
    title: string;
    controlsInfo: InputBase<TFormValue[keyof TFormValue]>[];
  }): FormDialogReference<TFormValue, BaseForm<TFormValue>> {
    return this.#modalService.openFormModal({
      data: {
        title: title,
        component: BaseForm<TFormValue>,
        componentBindings: [inputBinding('controlsInfo', () => controlsInfo)],
        cancelButtonText: EDIT_MESSAGES.cancelButton,
        confirmButtonText: EDIT_MESSAGES.applyButton,
      },
    });
  }

  #addIdToFormValue(formData: TFormValue, initDataId?: string | ((data: TFormValue) => string)) {
    if (initDataId && formData && typeof formData === 'object' && !('id' in formData)) {
      const id = typeof initDataId === 'function' ? initDataId(formData) : initDataId;
      return { ...formData, id };
    }
    return formData;
  }
}
