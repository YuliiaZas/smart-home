import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable } from 'rxjs';
import { FormInputsArray, InputChips, InputText, OptionInfo } from '@shared/form';
import { CardLayout, Entity, HomeCardWithItemsIdsInfo } from '@shared/models';
import { EDIT_MESSAGES } from '@shared/constants';
import { CustomValidators } from '@shared/validation';
import { HOME_ITEMS_NUMBER_FOR_LAYOUT } from '@shared/constants/home-items-number-for-layout';
import { CardsFacade, HomeItemsFacade } from '@state';
import { BaseEditFormService } from './base-edit-form.service';

type CardDataFormValue = Pick<HomeCardWithItemsIdsInfo, 'title' | 'itemIds'>;

@Injectable({
  providedIn: 'root',
})
export class CardDataFormService extends BaseEditFormService<CardDataFormValue> {
  #cardsFacade = inject(CardsFacade);
  #homeItemsFacade = inject(HomeItemsFacade);
  #entity = Entity.CARD;

  cardsOrderedByTab = toSignal(this.#cardsFacade.cardsOrderedByTab$, { initialValue: {} as Record<string, string[]> });
  allHomeItems: Observable<OptionInfo<string>[]> = this.#homeItemsFacade.allHomeItems$;

  protected createInputsData(
    cardInfo?: CardDataFormValue,
    layout?: CardLayout
  ): FormInputsArray<CardDataFormValue, string> {
    return [
      new InputText({
        controlKey: 'title',
        label: EDIT_MESSAGES.label.title(this.#entity),
        value: cardInfo?.title,
      }),
      new InputChips({
        controlKey: 'itemIds',
        optionsAsync: this.#homeItemsFacade.allHomeItems$,
        validators: [CustomValidators.maxLengthConditional(HOME_ITEMS_NUMBER_FOR_LAYOUT, layout ?? '')],
        label: EDIT_MESSAGES.label.items,
        value: cardInfo?.itemIds,
      }),
    ];
  }

  addNew(): Observable<void> {
    return EMPTY;
  }

  edit(cardInfo: HomeCardWithItemsIdsInfo): Observable<void> {
    const controlsInfo = this.createInputsData(cardInfo, cardInfo.layout);
    const title = EDIT_MESSAGES.editEntity(this.#entity);

    return this.handleFormModal({
      title,
      controlsInfo,
      initDataId: cardInfo.id,
      submitHandler: (cardInfoValue) => this.#cardsFacade.changeCurrentCard(cardInfoValue),
      cancelHandler: () => this.#cardsFacade.discardCurrentCardChanges(),
    });
  }
}
