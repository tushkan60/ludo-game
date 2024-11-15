import { inject, Injectable, signal } from '@angular/core';
import { DiceRoll, GameState, HandResult, RoundState } from '../types/game.types';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly TOTAL_DICE = 5;

  private readonly MAX_ROLLS = 3;

  private readonly storageService = inject(StorageService);

  private gameState = signal<GameState>({
    currentRound: 1,
    totalRounds: 1,
    roundState: {
      dice: [],
      rollsLeft: this.MAX_ROLLS,
      currentScore: 0,
      isComplete: false,
    },
    totalScore: 0,
    highScore: this.getHighScore(),
    isGameOver: false,
  });

  rollDice(currentDice: DiceRoll[]): DiceRoll[] {
    return currentDice.map((die) => (die.isHeld ? die : { ...die, value: this.rollDie() }));
  }

  private rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  evaluateHand(dice: DiceRoll[]): HandResult {
    const values = dice.map((d) => d.value).sort();
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
    if (this.isBigStraight(values)) {
      return { name: 'Big Straight', score: 35 };
    }
    if (this.isSmallStraight(values)) {
      return { name: 'Small Straight', score: 30 };
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

  getCounts(values: number[]): Map<number, number> {
    const counts = new Map<number, number>();
    values.forEach((value) => {
      counts.set(value, (counts.get(value) || 0) + 1);
    });
    return counts;
  }

  isFullHouse(counts: Map<number, number>): boolean {
    return Array.from(counts.values()).sort().toString() === '2,3';
  }

  isTwoPair(counts: Map<number, number>): boolean {
    const pairCount = Array.from(counts.values()).filter((count) => count === 2).length;
    return pairCount === 2;
  }

  isSmallStraight(values: number[]): boolean {
    const uniqueValues = Array.from(new Set(values)).sort().join(',');
    return uniqueValues.includes('1,2,3,4,5');
  }

  isBigStraight(values: number[]): boolean {
    const uniqueValues = Array.from(new Set(values)).sort().join(',');
    return uniqueValues.includes('2,3,4,5,6');
  }

  getHighScore(): number {
    return Number(this.storageService.getItem('dicePokerHighScore')) || 0;
  }

  saveHighScore(score: number): void {
    const currentHigh = this.getHighScore();
    if (score > currentHigh) {
      this.storageService.setItem('dicePokerHighScore', score.toString());
    }
  }

  initializeGame(totalRounds: number): void {
    this.gameState.set({
      currentRound: 1,
      totalRounds,
      roundState: {
        dice: Array.from({ length: this.TOTAL_DICE }, (_, index) => ({
          value: this.rollDie(),
          isHeld: false,
          id: index,
        })),
        rollsLeft: this.MAX_ROLLS,
        currentScore: 0,
        isComplete: false,
      },
      totalScore: 0,
      highScore: this.getHighScore(),
      isGameOver: false,
    });
  }

  completeRound(score: number): void {
    this.gameState.update((state) => ({
      ...state,
      totalScore: state.totalScore + score,
      roundState: {
        ...state.roundState,
        currentScore: score,
        isComplete: true,
      },
    }));
  }

  startNextRound(): void {
    this.gameState.update((state) => {
      if (state.currentRound >= state.totalRounds) {
        return {
          ...state,
          isGameOver: true,
        };
      }

      return {
        ...state,
        currentRound: state.currentRound + 1,
        roundState: {
          dice: Array.from({ length: this.TOTAL_DICE }, (_, index) => ({
            value: this.rollDie(),
            isHeld: false,
            id: index,
          })),
          rollsLeft: this.MAX_ROLLS,
          currentScore: 0,
          isComplete: false,
        },
      };
    });
  }

  updateRoundState(update: Partial<RoundState>): void {
    this.gameState.update((state) => ({
      ...state,
      roundState: {
        ...state.roundState,
        ...update,
      },
    }));
  }

  getGameState(): GameState {
    return this.gameState();
  }

  isLastRound(): boolean {
    const state = this.gameState();
    return state.currentRound === state.totalRounds;
  }
}
