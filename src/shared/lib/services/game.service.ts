import { inject, Injectable } from '@angular/core';
import { DiceRoll, GameState, HandResult } from '../types/game.types';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly TOTAL_DICE = 5;

  private readonly MAX_ROLLS = 3;

  private readonly storageService = inject(StorageService);

  initializeGame(): GameState {
    return {
      dice: Array.from({ length: this.TOTAL_DICE }, (_, index) => ({
        value: this.rollDie(),
        isHeld: false,
        id: index,
      })),
      rollsLeft: this.MAX_ROLLS,
      currentScore: 0,
      highScore: this.getHighScore(),
      isGameOver: false,
    };
  }

  rollDice(currentDice: DiceRoll[]): DiceRoll[] {
    return currentDice.map((die) => (die.isHeld ? die : { ...die, value: this.rollDie() }));
  }

  private rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  evaluateHand(dice: DiceRoll[]): HandResult {
    const values = dice.map((d) => d.value);
    const counts = this.getCounts(values);
    const maxCount = Math.max(...counts.values());

    if (maxCount === 5) {
      return { name: 'Five of a Kind', score: 50 };
    }
    if (maxCount === 4) {
      return { name: 'Four of a Kind', score: 40 };
    }
    if (this.isFullHouse(counts)) {
      return { name: 'Full House', score: 30 };
    }
    if (maxCount === 3) {
      return { name: 'Three of a Kind', score: 20 };
    }
    if (this.isTwoPair(counts)) {
      return { name: 'Two Pair', score: 15 };
    }
    if (maxCount === 2) {
      return { name: 'One Pair', score: 10 };
    }

    return {
      name: 'High Dice',
      score: Math.max(...values),
    };
  }

  private getCounts(values: number[]): Map<number, number> {
    const counts = new Map<number, number>();
    values.forEach((value) => {
      counts.set(value, (counts.get(value) || 0) + 1);
    });
    return counts;
  }

  private isFullHouse(counts: Map<number, number>): boolean {
    return Array.from(counts.values()).sort().toString() === '2,3';
  }

  private isTwoPair(counts: Map<number, number>): boolean {
    const pairCount = Array.from(counts.values()).filter((count) => count === 2).length;
    return pairCount === 2;
  }

  private getHighScore(): number {
    return Number(this.storageService.getItem('dicePokerHighScore')) || 0;
  }

  saveHighScore(score: number): void {
    const currentHigh = this.getHighScore();
    if (score > currentHigh) {
      this.storageService.setItem('dicePokerHighScore', score.toString());
    }
  }
}
