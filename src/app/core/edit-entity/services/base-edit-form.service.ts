import { inject, Injectable, inputBinding } from '@angular/core';
import { EMPTY, filter, map, merge, Observable, of, race, switchMap, take, tap } from 'rxjs';
import { EDIT_MESSAGES } from '@shared/constants';
import { BaseForm, InputBase } from '@shared/form';
import { FormDialogReference, ModalService } from '@shared/modal';

interface FormSubmissionConfig<TFormValue> {
  initDataId?: string | ((data: TFormValue) => string);
  submitHandler: (formValue: TFormValue) => void;
  successObservable?: Observable<void>;
  errorObservable?: Observable<string | null>;
}

interface FormCancellationConfig {
  cancelHandler?: () => void;
}

interface FormModalConfig<TFormValue> extends FormSubmissionConfig<TFormValue>, FormCancellationConfig {
  title: string;
  controlsInfo: InputBase<TFormValue[keyof TFormValue]>[];
}

@Injectable({
  providedIn: 'root',
})
export abstract class BaseEditFormService<TFormValue> {
  #modalService = inject(ModalService);

  abstract addNew(...arguments_: unknown[]): Observable<void>;
  abstract edit(entityInfo: TFormValue): Observable<void>;

  protected abstract createInputsData(entityInfo?: TFormValue): InputBase<TFormValue[keyof TFormValue]>[];

  protected handleFormModal({
    title,
    controlsInfo,
    initDataId,
    submitHandler,
    cancelHandler,
    successObservable,
    errorObservable,
  }: FormModalConfig<TFormValue>): Observable<void> {
    const formModal = this.#createFormModal({
      title,
      controlsInfo,
    });

    return merge(
      this.#handleFormSubmission(formModal, { initDataId, submitHandler, successObservable, errorObservable }),
      this.#handleModalCancellation(formModal, { cancelHandler })
    ).pipe(take(1));
  }

  #handleFormSubmission(
    formModal: FormDialogReference<TFormValue, BaseForm<TFormValue>>,
    config: FormSubmissionConfig<TFormValue>
  ): Observable<void> {
    let isSubmitting = false;

    return formModal.onConfirm().pipe(
      filter(() => !isSubmitting),
      tap(() => (isSubmitting = true)),
      map((formValue) => this.#addIdToFormValue(formValue, config.initDataId)),
      switchMap((formData) => {
        config.submitHandler(formData);

        if (!config.successObservable && !config.errorObservable) {
          formModal.close();
          return of(void 0);
        }

        formModal.setLoading(true);

        return race([
          config.successObservable!.pipe(
            take(1),
            tap(() => {
              isSubmitting = false;
              formModal.close();
              formModal.setLoading(false);
            })
          ),
          config.errorObservable!.pipe(
            filter((error) => error !== null),
            take(1),
            tap((errorMessage) => {
              isSubmitting = false;
              formModal.setLoading(false);
              formModal.setError(errorMessage);
            }),
            switchMap(() => EMPTY)
          ),
        ]);
      })
    );
  }

  #handleModalCancellation(
    formModal: FormDialogReference<TFormValue, BaseForm<TFormValue>>,
    config: FormCancellationConfig
  ): Observable<void> {
    return formModal.afterClosed().pipe(
      filter((result) => result === false),
      tap(() => {
        if (config.cancelHandler) {
          config.cancelHandler();
        }
      }),
      map(() => void 0)
    );
  }

  #createFormModal({
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

  #addIdToFormValue(formData: TFormValue, initDataId?: string | ((data: TFormValue) => string)): TFormValue {
    if (initDataId && formData && typeof formData === 'object' && !('id' in formData)) {
      const id = typeof initDataId === 'function' ? initDataId(formData) : initDataId;
      return { ...formData, id };
    }
    return formData;
  }
}
