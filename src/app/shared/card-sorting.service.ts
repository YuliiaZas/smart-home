import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardSortingService {
  groups = 3;
  preferencesName = 'cardSorting';
  emptyStorage: string[][] = [];

  getCardsSorting(dashboard: string, cards: string[]): string[][] {
    const cardSorting = localStorage.getItem(dashboard);
    if (cardSorting) {
      return JSON.parse(cardSorting) as string[][];
    }
    return this.getDefaultSorting(dashboard, cards);
  }

  setCardsSorting(dashboard: string, cardSorting: string[][]): void {
    localStorage.setItem(dashboard, JSON.stringify(cardSorting));
  }

  getDefaultSorting(dashboard: string, cards: string[]): string[][] {
    const defaultSorting = this.calculateDefaultSorting(cards);
    this.setCardsSorting(dashboard, defaultSorting);
    return defaultSorting;
  }

  private calculateDefaultSorting(cards: string[]): string[][] {
    const defaultSorting: string[][] = [];
    let index = 0;
    for (const cardId of cards) {
      const groupIndex = index % this.groups;
      if (!defaultSorting[groupIndex]) {
        defaultSorting[groupIndex] = [];
      }
      defaultSorting[groupIndex].push(cardId);
      index++;
    }
    return defaultSorting;
  }
}
