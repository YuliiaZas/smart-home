import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { CustomValidators } from '@shared/validation';
import { InputBase, InputText } from '@shared/form';
import { Entity, EntityInfo } from '@shared/models';
import { EDIT_MESSAGES } from '@shared/constants';
import { getKebabCase, getUniqueId } from '@shared/utils';
import { TabsFacade } from '@state';
import { BaseEditFormService } from './base-edit-form.service';

@Injectable({
  providedIn: 'root',
})
export class TabInfoFormService extends BaseEditFormService<EntityInfo> {
  #tabsFacade = inject(TabsFacade);
  #entity = Entity.TAB;

  userTabsTitles = toSignal(this.#tabsFacade.tabsTitles$, { initialValue: [] });
  userTabsIds = toSignal(this.#tabsFacade.tabsIds$, { initialValue: [] });

  protected createInputsData(dashboardInfo?: EntityInfo): InputBase<string>[] {
    return [
      new InputText({
        controlKey: 'title',
        label: EDIT_MESSAGES.label.title(this.#entity),
        required: true,
        validators: [
          Validators.maxLength(50),
          CustomValidators.uniqueWithinArray(this.userTabsTitles(), dashboardInfo?.title),
        ],
        validationErrorOptions: { uniqueArea: this.#entity },
        value: dashboardInfo?.title,
      }),
    ];
  }

  addNew(): Observable<void> {
    const controlsInfo = this.createInputsData();
    const title = EDIT_MESSAGES.createEntity(this.#entity);

    return this.handleFormModal({
      title,
      controlsInfo,
      initDataId: (tabInfo) => getUniqueId(getKebabCase(tabInfo.title), this.userTabsIds()),
      submitHandler: (tabInfo) => this.#tabsFacade.addTab(tabInfo),
    });
  }

  edit(entityInfo: EntityInfo): Observable<void> {
    if (!entityInfo) return EMPTY;

    const controlsInfo = this.createInputsData(entityInfo);
    const title = EDIT_MESSAGES.renameEntity(this.#entity);

    return this.handleFormModal({
      title,
      controlsInfo,
      initDataId: entityInfo.id,
      submitHandler: (tabInfo) => this.#tabsFacade.renameTab(tabInfo),
    });
  }
}
