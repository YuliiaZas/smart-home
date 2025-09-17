import { inject, Injectable, inputBinding } from '@angular/core';
import { EMPTY, filter, map, merge, Observable, of, race, switchMap, take, tap } from 'rxjs';
import { EDIT_MESSAGES } from '@shared/constants';
import { BaseForm, FormInputsArray, InputBase } from '@shared/form';
import { FormDialogReference, ModalService } from '@shared/modal';
import { FormCancellationConfig, FormModalConfig, FormSubmissionConfig } from '../models/form-modal-config';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseEditFormService<TFormValue> {
  #modalService = inject(ModalService);

  abstract addNew(...arguments_: unknown[]): Observable<void>;
  abstract edit(entityInfo: TFormValue): Observable<void>;

  protected abstract createInputsData(entityInfo?: TFormValue): FormInputsArray<TFormValue>;

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

  #addIdToFormValue(
    formData: TFormValue,
    initDataId?: string | ((data: TFormValue) => string)
  ): TFormValue & { id: string } {
    if (!formData || typeof formData !== 'object') {
      throw new Error('Form data is invalid or not an object');
    } else if ('id' in formData && formData.id) {
      return formData as TFormValue & { id: string };
    } else if (initDataId) {
      const id = typeof initDataId === 'function' ? initDataId(formData) : initDataId;
      return { ...formData, id };
    } else {
      throw new Error('ID is missing in form data and no initDataId provided');
    }
  }
}
