import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { EMPTY, filter, map, Observable } from 'rxjs';
import { CustomValidators } from '@shared/validation';
import { FormInputsArray, InputIcon, InputText } from '@shared/form';
import { DashboardInfo } from '@shared/models/dashboard-info';
import { Entity } from '@shared/models';
import {
  EDIT_MESSAGES,
  failureActionMessages,
  PATTERN_VALIDATION_MESSAGES,
  VALIDATION_LIMITS,
} from '@shared/constants';
import { DashboardsFacade } from '@state';
import { BaseEditFormService } from './base-edit-form.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardInfoFormService extends BaseEditFormService<DashboardInfo> {
  #dashboardsFacade = inject(DashboardsFacade);
  #entity = Entity.DASHBOARD;
  userDashboardIds = toSignal(this.#dashboardsFacade.userDashboardIds$, { initialValue: [] });

  dashboardAdded$ = this.#dashboardsFacade.userDashboardsShouldBeRefetched$.pipe(
    filter((isDashboardAdded) => isDashboardAdded),
    map(() => void 0)
  );

  addDashboardError$ = this.#dashboardsFacade.addDashboardError$.pipe(
    map((failureActionKey) => (failureActionKey ? failureActionMessages[failureActionKey] : ''))
  );

  addNew(): Observable<void> {
    const controlsInfo = this.createInputsData(undefined, true);
    const title = EDIT_MESSAGES.createEntity(this.#entity);

    return this.handleFormModal({
      title,
      controlsInfo,
      submitHandler: (dashboardInfo) => {
        this.#dashboardsFacade.clearDashboardListError();
        this.#dashboardsFacade.addDashboard(dashboardInfo);
      },
      successObservable: this.dashboardAdded$,
      errorObservable: this.addDashboardError$,
    });
  }

  edit(dashboardInfo: DashboardInfo): Observable<void> {
    if (!dashboardInfo) return EMPTY;

    const controlsInfo = this.createInputsData(dashboardInfo);
    const title = EDIT_MESSAGES.renameEntity(this.#entity);

    return this.handleFormModal({
      title,
      controlsInfo,
      initDataId: dashboardInfo.id,
      submitHandler: (dashboardInfo) => this.#dashboardsFacade.changeDashboardInfo(dashboardInfo),
    });
  }

  protected createInputsData(dashboardInfo?: DashboardInfo, showIdField = false): FormInputsArray<DashboardInfo> {
    const defaultInputs = [
      new InputText({
        controlKey: 'title',
        label: EDIT_MESSAGES.label.title(this.#entity),
        required: true,
        validators: [Validators.maxLength(VALIDATION_LIMITS.DASHBOARD_TITLE_MAX_LENGTH)],
        value: dashboardInfo?.title,
      }),
      new InputIcon({
        controlKey: 'icon',
        label: EDIT_MESSAGES.label.icon(this.#entity),
        required: true,
        value: dashboardInfo?.icon,
        hint: EDIT_MESSAGES.hint.icon,
      }),
    ];
    return showIdField
      ? [
          new InputText({
            controlKey: 'id',
            label: EDIT_MESSAGES.label.id(this.#entity),
            required: true,
            validators: [
              Validators.maxLength(VALIDATION_LIMITS.DASHBOARD_ID_MAX_LENGTH),
              Validators.pattern(VALIDATION_LIMITS.PATTERN.ID),
              CustomValidators.uniqueWithinArray(this.userDashboardIds(), dashboardInfo?.id),
            ],
            validationErrorOptions: { uniqueArea: this.#entity, patternMessage: PATTERN_VALIDATION_MESSAGES.ID },
            value: dashboardInfo?.id,
          }),
          ...defaultInputs,
        ]
      : defaultInputs;
  }
}
