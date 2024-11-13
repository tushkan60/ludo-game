import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { GameService } from '../../shared/lib/services/game.service';
import { DiceRoll, GameState, HandResult } from '../../shared/lib/types/game.types';
import { DiceComponent } from '../../shared/components/dice/dice.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [DiceComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private readonly gameService = inject(GameService);

  private readonly destroyRef = inject(DestroyRef);

  state = signal<GameState>(this.gameService.initializeGame());

  currentHand = signal<HandResult>({ name: 'Nothing', score: 0 });

  isRolling = signal(false);

  isActionDisabled = computed(
    () => this.state().rollsLeft === 3 || this.state().isGameOver || this.isRolling(),
  );

  isRollDisabled = computed(
    () => this.state().rollsLeft === 0 || this.state().isGameOver || this.isRolling(),
  );

  roll(): void {
    if (this.isRollDisabled()) return;

    this.isRolling.set(true);

    timer(600)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.state.update((state) => {
          const newDice = this.gameService.rollDice(state.dice);
          const rollsLeft = state.rollsLeft - 1;
          const hand = this.gameService.evaluateHand(newDice);

          this.currentHand.set(hand);

          if (rollsLeft === 0) {
            this.gameService.saveHighScore(hand.score);
          }

          return {
            ...state,
            dice: newDice,
            rollsLeft,
            currentScore: hand.score,
            isGameOver: rollsLeft === 0,
          };
        });

        this.isRolling.set(false);
      });
  }

  toggleHold(die: DiceRoll): void {
    if (this.isActionDisabled()) {
      return;
    }

    this.state.update((state) => ({
      ...state,
      dice: state.dice.map((d) => (d.id === die.id ? { ...d, isHeld: !d.isHeld } : d)),
    }));
  }

  newGame(): void {
    this.state.set(this.gameService.initializeGame());
    this.currentHand.set({ name: 'Nothing', score: 0 });
  }
}
