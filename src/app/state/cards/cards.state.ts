import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { isEqual, map } from 'lodash';
import { DashboardTab, HomeCardWithItemsIdsInfo } from '@shared/models';
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
    const newState: CardsState = { ...initialState, cardsOrderedByTab: getCardIdsOrderedByTab(tabs) };
    return cardsAdapter.setAll(
      tabs.flatMap(({ cards }) =>
        cards.map((card) => {
          const { items, ...cardInfo } = card;
          const cardWithItemsIds: HomeCardWithItemsIdsInfo = { ...cardInfo, itemIds: map(card.items, 'id') };
          return cardWithItemsIds;
        })
      ),
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
  on(cardsActions.changeCurrentCard, (state, { cardData }): CardsState => {
    if (!state.originalCurrentCardData) return state;
    const isChanged = !isEqual(state.originalCurrentCardData, {
      ...cardData,
      layout: state.originalCurrentCardData!.layout,
    });
    const newState: CardsState = {
      ...state,
      isChanged,
      currentCardId: null,
      originalCurrentCardData: null,
    };
    if (!isChanged) return newState;
    return cardsAdapter.updateOne({ id: cardData.id, changes: cardData }, newState);
  }),

  on(cardsActions.discardCurrentCardChanges, (state): CardsState => {
    if (!state.originalCurrentCardData) return state;
    const newState: CardsState = {
      ...state,
      currentCardId: null,
      originalCurrentCardData: null,
    };
    return cardsAdapter.upsertOne(state.originalCurrentCardData, newState);
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
    const card: HomeCardWithItemsIdsInfo = { ...cardInfo, title: '', itemIds: [] };
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
    selectCardsByTabs: createSelector(selectCardsOrderedByTab, selectEntities, (cardIdsOrderedByTab, entities) => {
      const cardsByTab: Record<string, HomeCardWithItemsIdsInfo[]> = {};
      for (const [tabId, cardIds] of Object.entries(cardIdsOrderedByTab)) {
        cardsByTab[tabId] = cardIds
          .map((cardId) => entities[cardId])
          .filter((card): card is HomeCardWithItemsIdsInfo => !!card);
      }
      return cardsByTab;
    }),
  }),
});

function getCardIdsOrderedByTab(tabs: DashboardTab[]): Record<string, string[]> {
  const cardIdsOrderedByTab: Record<string, string[]> = {};
  for (const tab of tabs) {
    cardIdsOrderedByTab[tab.id] = tab.cards.map((card) => card.id);
  }
  return cardIdsOrderedByTab;
}
