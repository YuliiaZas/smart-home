import { DashboardTabInfo, HomeCardInfo, HomeItemInfo } from '@shared/models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { cardsActions } from './cards.actions';

interface CardsState extends EntityState<HomeCardInfo> {
  cardsOrderedByTab: Record<string, string[]>;

  originalCards: HomeCardInfo[] | null;
  originalCardsOrderedByTab: Record<string, string[]>;

  currentCardId: string | null;
  originalCurrentCardData: HomeCardInfo | null;

  isChanged: boolean;
}

const cardsAdapter = createEntityAdapter<HomeCardInfo>({
  selectId: (card: HomeCardInfo) => card.id,
});

const initialState: CardsState = cardsAdapter.getInitialState({
  cardsOrderedByTab: {},

  originalCards: null,
  originalCardsOrderedByTab: {},

  currentCardId: null,
  originalCurrentCardData: null,

  isChanged: false,
});

const reducer = createReducer<CardsState>(
  initialState,
  on(
    cardsActions.setCardsData,
    (_, { tabs }): CardsState =>
      cardsAdapter.setAll(
        tabs.flatMap(({ cards }) => cards),
        { ...initialState, cardsOrderedByTab: getCardsOrderedByTab(tabs) }
      )
  ),

  on(
    cardsActions.enterEditMode,
    (state): CardsState => ({
      ...state,
      originalCards: Object.values(state.entities).filter((entity): entity is HomeCardInfo => !!entity),
      originalCardsOrderedByTab: structuredClone(state.cardsOrderedByTab),
    })
  ),
  on(
    cardsActions.exitEditMode,
    (state): CardsState => ({
      ...state,
      originalCards: null,
      originalCardsOrderedByTab: {},
      isChanged: false,
    })
  ),
  on(cardsActions.discardChanges, (state): CardsState => {
    if (!state.originalCards) return state;
    return cardsAdapter.setAll(state.originalCards, {
      ...state,
      cardsOrderedByTab: structuredClone(state.originalCardsOrderedByTab),
    });
  }),

  on(
    cardsActions.enterCardEditMode,
    (state, { cardId }): CardsState => ({
      ...state,
      currentCardId: cardId,
      originalCurrentCardData: state.entities[cardId] || null,
    })
  ),
  on(
    cardsActions.saveCurrentCardChanges,
    (state): CardsState => ({
      ...state,
      currentCardId: null,
      originalCurrentCardData: null,
    })
  ),
  on(cardsActions.discardCurrentCardChanges, (state): CardsState => {
    if (!state.originalCurrentCardData) return state;
    return cardsAdapter.upsertOne(state.originalCurrentCardData, {
      ...state,
      currentCardId: null,
      originalCurrentCardData: null,
    });
  }),

  on(cardsActions.renameCurrentCard, (state, { title }): CardsState => {
    const currentCardId = state.currentCardId;
    if (!currentCardId) return state;
    return cardsAdapter.updateOne({ id: currentCardId, changes: { title } }, { ...state, isChanged: true });
  }),

  on(cardsActions.addItemToCurrentCard, (state, { item }): CardsState => {
    const updatedCard = addItemToCurrentCard(state, item);
    return updatedCard ? cardsAdapter.upsertOne(updatedCard, { ...state, isChanged: true }) : state;
  }),
  on(cardsActions.removeItemFromCurrentCard, (state, { orderIndex }): CardsState => {
    const updatedCard = removeItemByIndexFromCurrentCard(state, orderIndex);
    return updatedCard ? cardsAdapter.upsertOne(updatedCard, { ...state, isChanged: true }) : state;
  }),

  on(
    cardsActions.reorderCards,
    (state, { tabId, cardsIdsOrdered }): CardsState => ({
      ...state,
      cardsOrderedByTab: {
        ...state.cardsOrderedByTab,
        [tabId]: cardsIdsOrdered,
      },
      isChanged: true,
    })
  ),

  on(cardsActions.addCard, (state, { tabId, cardInfo }): CardsState => {
    const card: HomeCardInfo = { ...cardInfo, items: [] };
    return cardsAdapter.addOne(card, {
      ...state,
      cardsOrderedByTab: {
        ...state.cardsOrderedByTab,
        [tabId]: [...(state.cardsOrderedByTab[tabId] || []), card.id],
      },
      isChanged: true,
    });
  }),

  on(cardsActions.deleteCard, (state, { tabId, cardId }): CardsState => {
    return cardsAdapter.removeOne(cardId, {
      ...state,
      cardsOrderedByTab: {
        ...state.cardsOrderedByTab,
        [tabId]: state.cardsOrderedByTab[tabId].filter((id) => id !== cardId),
      },
      isChanged: true,
    });
  })
);

export const cardsFeature = createFeature({
  name: 'cards',
  reducer,
  extraSelectors: ({ selectCurrentCardId, selectEntities, selectCardsOrderedByTab }) => ({
    selectCurrentCard: createSelector(selectCurrentCardId, selectEntities, (currentCardId, entities) =>
      currentCardId ? entities[currentCardId] : null
    ),
    selectCardsByTabs: createSelector(selectCardsOrderedByTab, selectEntities, (cardIdssOrderedByTab, entities) => {
      const cardsByTab: Record<string, HomeCardInfo[]> = {};
      for (const [tabId, cardIds] of Object.entries(cardIdssOrderedByTab)) {
        cardsByTab[tabId] = cardIds.map((cardId) => entities[cardId]).filter((card): card is HomeCardInfo => !!card);
      }
      return cardsByTab;
    }),
  }),
});

function getCurrentCard(state: CardsState): HomeCardInfo | null {
  const currentCardId = state.currentCardId;
  return currentCardId ? state.entities[currentCardId] || null : null;
}

function addItemToCurrentCard(state: CardsState, item: HomeItemInfo): HomeCardInfo | null {
  const currentCard = getCurrentCard(state);
  if (!currentCard) return null;
  return {
    ...currentCard,
    items: [...(currentCard.items || []), item],
  };
}

function removeItemByIndexFromCurrentCard(state: CardsState, orderIndex: number): HomeCardInfo | null {
  const currentCard = getCurrentCard(state);
  if (!currentCard) return null;
  return {
    ...currentCard,
    items: (currentCard.items || []).filter((_, index) => index !== orderIndex),
  };
}

function getCardsOrderedByTab(tabs: DashboardTabInfo[]): Record<string, string[]> {
  const accumulator: Record<string, string[]> = {};
  for (const tab of tabs) {
    accumulator[tab.id] = tab.cards.map((card) => card.id);
  }
  return accumulator;
}
