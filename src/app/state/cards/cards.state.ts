import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { map } from 'lodash';
import { DashboardTabInfo, HomeCardWithItemsIdsInfo } from '@shared/models';
import { cardsActions } from './cards.actions';

interface CardsState extends EntityState<HomeCardWithItemsIdsInfo> {
  cardsOrderedByTab: Record<string, string[]>;

  originalCards: HomeCardWithItemsIdsInfo[] | null;
  originalCardsOrderedByTab: Record<string, string[]>;

  currentCardId: string | null;
  originalCurrentCardData: HomeCardWithItemsIdsInfo | null;

  isChanged: boolean;
}

const cardsAdapter = createEntityAdapter<HomeCardWithItemsIdsInfo>({
  selectId: (card: HomeCardWithItemsIdsInfo) => card.id,
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
  on(cardsActions.setCardsData, (_, { tabs }): CardsState => {
    const newState: CardsState = { ...initialState, cardsOrderedByTab: getCardsOrderedByTab(tabs) };
    return cardsAdapter.setAll(
      tabs.flatMap(({ cards }) => cards.map((card) => ({ ...card, items: map(card.items, 'id') }))),
      newState
    );
  }),

  on(
    cardsActions.enterEditMode,
    (state): CardsState => ({
      ...state,
      originalCards: Object.values(state.entities).filter((entity): entity is HomeCardWithItemsIdsInfo => !!entity),
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
    const newState: CardsState = {
      ...state,
      cardsOrderedByTab: structuredClone(state.originalCardsOrderedByTab),
    };
    return cardsAdapter.setAll(state.originalCards, newState);
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
    const newState: CardsState = {
      ...state,
      currentCardId: null,
      originalCurrentCardData: null,
    };
    return cardsAdapter.upsertOne(state.originalCurrentCardData, newState);
  }),

  on(cardsActions.renameCurrentCard, (state, { title }): CardsState => {
    const currentCardId = state.currentCardId;
    if (!currentCardId) return state;
    const newState: CardsState = { ...state, isChanged: true };
    return cardsAdapter.updateOne({ id: currentCardId, changes: { title } }, newState);
  }),

  on(cardsActions.addItemToCurrentCard, (state, { itemId }): CardsState => {
    const updatedCard = addItemToCurrentCard(state, itemId);
    if (!updatedCard) return state;
    const newState: CardsState = { ...state, isChanged: true };
    return cardsAdapter.upsertOne(updatedCard, newState);
  }),
  on(cardsActions.removeItemFromCurrentCard, (state, { orderIndex }): CardsState => {
    const updatedCard = removeItemByIndexFromCurrentCard(state, orderIndex);
    if (!updatedCard) return state;
    const newState: CardsState = { ...state, isChanged: true };
    return cardsAdapter.upsertOne(updatedCard, newState);
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
    const card: HomeCardWithItemsIdsInfo = { ...cardInfo, items: [] };
    const newState: CardsState = {
      ...state,
      cardsOrderedByTab: {
        ...state.cardsOrderedByTab,
        [tabId]: [...(state.cardsOrderedByTab[tabId] || []), card.id],
      },
      isChanged: true,
    };
    return cardsAdapter.addOne(card, newState);
  }),

  on(cardsActions.deleteCard, (state, { tabId, cardId }): CardsState => {
    const newState: CardsState = {
      ...state,
      cardsOrderedByTab: {
        ...state.cardsOrderedByTab,
        [tabId]: state.cardsOrderedByTab[tabId].filter((id) => id !== cardId),
      },
      isChanged: true,
    };
    return cardsAdapter.removeOne(cardId, newState);
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
      const cardsByTab: Record<string, HomeCardWithItemsIdsInfo[]> = {};
      for (const [tabId, cardIds] of Object.entries(cardIdssOrderedByTab)) {
        cardsByTab[tabId] = cardIds
          .map((cardId) => entities[cardId])
          .filter((card): card is HomeCardWithItemsIdsInfo => !!card);
      }
      return cardsByTab;
    }),
  }),
});

function getCurrentCard(state: CardsState): HomeCardWithItemsIdsInfo | null {
  const currentCardId = state.currentCardId;
  return currentCardId ? state.entities[currentCardId] || null : null;
}

function addItemToCurrentCard(state: CardsState, itemId: string): HomeCardWithItemsIdsInfo | null {
  const currentCard = getCurrentCard(state);
  if (!currentCard) return null;
  return {
    ...currentCard,
    items: [...(currentCard.items || []), itemId],
  };
}

function removeItemByIndexFromCurrentCard(state: CardsState, orderIndex: number): HomeCardWithItemsIdsInfo | null {
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
