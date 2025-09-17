import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable } from 'rxjs';
import { FormInputsArray, InputSelect, OptionInfo } from '@shared/form';
import { CardInfo, CardLayout, Entity } from '@shared/models';
import { EDIT_MESSAGES, LAYOUT_MESSAGES } from '@shared/constants';
import { getKebabCase, getUniqueId } from '@shared/utils';
import { CardsFacade } from '@state';
import { BaseEditFormService } from './base-edit-form.service';

type CardInfoFormValue = Pick<CardInfo, 'layout'>;

@Injectable({
  providedIn: 'root',
})
export class CardLayoutFormService extends BaseEditFormService<CardInfoFormValue> {
  #cardsFacade = inject(CardsFacade);
  #entity = Entity.CARD;
  cardLayouts: OptionInfo<CardLayout>[] = Object.values(CardLayout).map((layout) => ({
    id: layout,
    label: LAYOUT_MESSAGES[layout],
  }));

  cardsOrderedByTab = toSignal(this.#cardsFacade.cardsOrderedByTab$, { initialValue: {} as Record<string, string[]> });

  protected createInputsData(): FormInputsArray<CardInfoFormValue, CardLayout> {
    return [
      new InputSelect({
        controlKey: 'layout',
        options: this.cardLayouts,
        label: EDIT_MESSAGES.label.layout,
        required: true,
        hint: EDIT_MESSAGES.hint.layout,
      }),
    ];
  }

  addNew(tabId: string): Observable<void> {
    const controlsInfo = this.createInputsData();
    const title = EDIT_MESSAGES.createEntity(this.#entity);
    const cardsIds = Object.values(this.cardsOrderedByTab()).flat();

    return this.handleFormModal({
      title,
      controlsInfo,
      initDataId: () => getUniqueId(getKebabCase(tabId), cardsIds),
      submitHandler: (cardInfo) => this.#cardsFacade.addCard(tabId, cardInfo),
    });
  }

  edit(): Observable<void> {
    return EMPTY;
  }
}
