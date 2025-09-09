import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable } from 'rxjs';
import { InputBase, InputText } from '@shared/form-input';
import { Entity, HomeCardWithItemsIdsInfo } from '@shared/models';
import { EDIT_MESSAGES } from '@shared/constants';
import { CardsFacade, HomeItemsFacade } from '@state';
import { BaseEditFormService } from './base-edit-form.service';
import { InputChips } from '@shared/form-input/models/typed-inputs/input-chips';
import { CustomValidators } from '@shared/validation';
import { HOME_ITEMS_NUMBER_FOR_LAYOUT } from '@shared/constants/home-items-number-for-layout';

@Injectable({
  providedIn: 'root',
})
export class CardDataFormService extends BaseEditFormService<Omit<HomeCardWithItemsIdsInfo, 'layout'>> {
  private cardsFacade = inject(CardsFacade);
  private homeItemsFacade = inject(HomeItemsFacade);
  #entity = Entity.CARD;

  cardsOrderedByTab = toSignal(this.cardsFacade.cardsOrderedByTab$, { initialValue: {} as Record<string, string[]> });
  allHomeItems = toSignal(this.homeItemsFacade.allHomeItems$, { initialValue: [] });

  protected createInputsData(cardInfo?: Omit<HomeCardWithItemsIdsInfo, 'layout'>): InputBase<string>[] {
    return [
      new InputText({
        controlKey: 'title',
        label: EDIT_MESSAGES.label.title(this.#entity),
        value: cardInfo?.title,
      }),
      new InputChips({
        controlKey: 'itemIds',
        optionsAsync: this.homeItemsFacade.allHomeItems$,
        validators: [
          CustomValidators.maxLengthConditional(
            HOME_ITEMS_NUMBER_FOR_LAYOUT,
            (cardInfo as HomeCardWithItemsIdsInfo)?.layout
          ),
        ],
        label: EDIT_MESSAGES.label.items,
        value: cardInfo?.itemIds,
      }),
    ];
  }

  addNew(): Observable<Omit<HomeCardWithItemsIdsInfo, 'layout'> | null> {
    return EMPTY;
  }

  edit(cardInfo: HomeCardWithItemsIdsInfo): Observable<Omit<HomeCardWithItemsIdsInfo, 'layout'> | null> {
    const controlsInfo: InputBase<string>[] = this.createInputsData(cardInfo);
    const title = EDIT_MESSAGES.editEntity(this.#entity);

    return this.getSubmittedValueFromCreatedForm({
      title,
      controlsInfo,
      initDataId: cardInfo.id,
    });
  }
}
