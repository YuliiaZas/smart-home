import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable } from 'rxjs';
import { InputBase, InputSelect } from '@shared/form-input';
import { CardInfo, CardLayout, Entity } from '@shared/models';
import { EDIT_MESSAGES, LAYOUT_MESSAGES } from '@shared/constants';
import { getKebabCase, getUniqueId } from '@shared/utils';
import { CardsFacade } from '@state';
import { BaseEditFormService } from './base-edit-form.service';

@Injectable({
  providedIn: 'root',
})
export class CardLayoutFormService extends BaseEditFormService<Pick<CardInfo, 'id' | 'layout'>> {
  private cardsFacade = inject(CardsFacade);
  #entity = Entity.CARD;
  cardLayouts = Object.values(CardLayout).map((layout) => ({ id: layout, label: LAYOUT_MESSAGES[layout] }));

  cardsOrderedByTab = toSignal(this.cardsFacade.cardsOrderedByTab$, { initialValue: {} as Record<string, string[]> });

  protected createInputsData(): InputBase<string>[] {
    return [
      new InputSelect({
        controlKey: 'layout',
        options: this.cardLayouts,
        label: EDIT_MESSAGES.label.layout,
        required: true,
      }),
    ];
  }

  addNew(tabId: string): Observable<Pick<CardInfo, 'id' | 'layout'> | null> {
    const controlsInfo: InputBase<string>[] = this.createInputsData();
    const title = EDIT_MESSAGES.createEntity(this.#entity);
    const currentTabCardsIds = this.cardsOrderedByTab()[tabId] || [];

    return this.getSubmittedValueFromCreatedForm({
      title,
      controlsInfo,
      initDataId: () => getUniqueId(getKebabCase(tabId), currentTabCardsIds),
    });
  }

  edit(): Observable<CardInfo | null> {
    return EMPTY;
  }
}
