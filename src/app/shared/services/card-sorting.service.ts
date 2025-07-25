import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardSortingService {
  getCardsSorting(dashboard: string, cardIds: string[]): string[] {
    const cardSortingFromStorage = localStorage.getItem(dashboard);

    if (cardSortingFromStorage) {
      try {
        const cardSorting = JSON.parse(cardSortingFromStorage);
        if (!this.isArrayOfStrings(cardSorting)) return cardIds;
        if (this.areCardsUpToDate(cardSorting, cardIds)) return cardSorting;
      } catch (error) {
        console.error('Error parsing card sorting from localStorage:', error);
        return cardIds;
      }
    }

    this.setCardsSorting(dashboard, cardIds);
    return cardIds;
  }

  setCardsSorting(dashboard: string, cardSorting: string[]): void {
    try {
      localStorage.setItem(dashboard, JSON.stringify(cardSorting));
    } catch (error) {
      console.error('Error setting card sorting:', error);
    }
  }

  private areCardsUpToDate(cardSorting: string[], cardIds: string[]): boolean {
    return [...cardSorting].sort().join(',') === [...cardIds].sort().join(',');
  }

  private isArrayOfStrings(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
  }
}
