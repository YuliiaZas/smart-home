import { computed, inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { CustomValidators } from '@shared/validation';
import { InputBase, InputIcon, InputText } from '@shared/form-input';
import { DashboardInfo } from '@shared/models/dashboard-info';
import { Entity, FailureAction } from '@shared/models';
import { EDIT_MESSAGES, failureActionMessages } from '@shared/constants';
import { DashboardsFacade } from '@state';
import { BaseEditFormService } from './base-edit-form.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardInfoFormService extends BaseEditFormService<DashboardInfo> {
  #dashboardsFacade = inject(DashboardsFacade);
  #entity = Entity.DASHBOARD;
  userDashboardIds = toSignal(this.#dashboardsFacade.userDashboardIds$, { initialValue: [] });

  addNew(
    failureAction: Signal<FailureAction | null>,
    closeObservable: Observable<void>
  ): Observable<DashboardInfo | null> {
    const controlsInfo: InputBase<string>[] = this.createInputsData(undefined, true);
    const title = EDIT_MESSAGES.createEntity(this.#entity);
    const errorMessage = computed(() => {
      const failureActionKey = failureAction();
      return failureActionKey ? failureActionMessages[failureActionKey] : '';
    });

    return this.getSubmittedValueFromCreatedForm({
      title,
      controlsInfo,
      errorMessage,
      closeObservable,
    });
  }

  edit(dashboardInfo: DashboardInfo): Observable<DashboardInfo | null> {
    if (!dashboardInfo) return EMPTY;

    const controlsInfo: InputBase<string>[] = this.createInputsData(dashboardInfo);
    const title = EDIT_MESSAGES.renameEntity(this.#entity);

    return this.getSubmittedValueFromCreatedForm({
      title,
      controlsInfo,
      initDataId: dashboardInfo.id,
    });
  }

  protected createInputsData(dashboardInfo?: DashboardInfo, showIdField = false): InputBase<string>[] {
    const defaultInputs = [
      new InputText({
        controlKey: 'title',
        label: EDIT_MESSAGES.label.title(this.#entity),
        required: true,
        validators: [Validators.maxLength(50)],
        value: dashboardInfo?.title,
      }),
      new InputIcon({
        controlKey: 'icon',
        label: EDIT_MESSAGES.label.icon(this.#entity),
        required: true,
        value: dashboardInfo?.icon,
      }),
    ];
    return showIdField
      ? [
          new InputText({
            controlKey: 'id',
            label: EDIT_MESSAGES.label.id(this.#entity),
            required: true,
            validators: [Validators.maxLength(30), CustomValidators.uniqueWithinArray(this.userDashboardIds())],
            validationErrorOptions: { uniqueArea: this.#entity },
            value: dashboardInfo?.id,
          }),
          ...defaultInputs,
        ]
      : defaultInputs;
  }
}
