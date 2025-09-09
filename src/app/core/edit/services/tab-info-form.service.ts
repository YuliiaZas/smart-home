import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { CustomValidators } from '@shared/validation';
import { InputBase, InputText } from '@shared/form-input';
import { Entity, EntityInfo } from '@shared/models';
import { EDIT_MESSAGES } from '@shared/constants';
import { getKebabCase, getUniqueId } from '@shared/utils';
import { TabsFacade } from '@state';
import { BaseEditFormService } from './base-edit-form.service';

@Injectable({
  providedIn: 'root',
})
export class TabInfoFormService extends BaseEditFormService<EntityInfo> {
  private tabsFacade = inject(TabsFacade);
  #entity = Entity.TAB;

  userTabsTitles = toSignal(this.tabsFacade.tabsTitles$, { initialValue: [] });
  userTabsIds = toSignal(this.tabsFacade.tabsIds$, { initialValue: [] });

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

  addNew(): Observable<EntityInfo | null> {
    const controlsInfo: InputBase<string>[] = this.createInputsData();
    const title = EDIT_MESSAGES.createEntity(this.#entity);

    return this.getSubmittedValueFromCreatedForm({
      title,
      controlsInfo,
      initDataId: (tabInfo) => getUniqueId(getKebabCase(tabInfo.title), this.userTabsIds()),
    });
  }

  edit(entityInfo: EntityInfo): Observable<EntityInfo | null> {
    if (!entityInfo) return EMPTY;

    const controlsInfo: InputBase<string>[] = this.createInputsData(entityInfo);
    const title = EDIT_MESSAGES.renameEntity(this.#entity);

    return this.getSubmittedValueFromCreatedForm({ title, controlsInfo, initDataId: entityInfo.id });
  }
}
