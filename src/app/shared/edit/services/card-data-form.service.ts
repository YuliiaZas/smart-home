import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable } from 'rxjs';
import { InputBase, InputText } from '@shared/form-input';
import { Entity, HomeCardWithItemsIdsInfo } from '@shared/models';
import { EDIT_MESSAGES } from '@shared/constants';
import { CardsFacade, HomeItemsFacade } from '@state';
import { BaseEditFormService } from './base-edit-form.service';
import { InputChips } from '@shared/form-input/typed-inputs/input-chips';

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
        controlKey: 'items',
        optionsAsync: this.homeItemsFacade.allHomeItems$,
        label: EDIT_MESSAGES.label.items,
        value: cardInfo?.items,
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
