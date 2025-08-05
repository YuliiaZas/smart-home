import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardSortingService {
  groups = 3;

  getCardsSorting(dashboard: string, cardIds: string[]): string[][] {
    const cardSortingFromStorage = localStorage.getItem(dashboard);

    if (cardSortingFromStorage) {
      try {
        const cardSorting = JSON.parse(cardSortingFromStorage);
        if (!this.isArrayOfStringsArray(cardSorting)) return this.getDefaultSorting(dashboard, cardIds);
        if (this.areCardsUpToDate(cardSorting, cardIds)) return cardSorting;
      } catch (error) {
        console.error('Error parsing card sorting from localStorage:', error);
        return this.getDefaultSorting(dashboard, cardIds);
      }
    }

    return this.getDefaultSorting(dashboard, cardIds);
  }

  setCardsSorting(dashboard: string, cardSorting: string[][]): void {
    try {
      localStorage.setItem(dashboard, JSON.stringify(cardSorting));
    } catch (error) {
      console.error('Error setting card sorting:', error);
    }
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

  private areCardsUpToDate(cardSorting: string[][], cardIds: string[]): boolean {
    return cardSorting.flat().sort().join(',') === [...cardIds].sort().join(',');
  }

  private isArrayOfStringsArray(value: unknown): value is string[][] {
    return Array.isArray(value) && value.every((array) => this.isArrayOfStrings(array));
  }

  private isArrayOfStrings(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
  }
}
