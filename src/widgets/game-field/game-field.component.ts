import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { GameService } from '../../shared/lib/services/game.service';
import { DiceRoll, HandResult } from '../../shared/lib/types/game.types';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DiceComponent } from '../../shared/components/dice/dice.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-field',
  standalone: true,
  imports: [DiceComponent],
  templateUrl: './game-field.component.html',
  styleUrl: './game-field.component.scss',
})
export class GameFieldComponent {
  private readonly gameService = inject(GameService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly router = inject(Router);

  state = computed(() => this.gameService.getGameState());

  currentHand = signal<HandResult>({ name: 'Nothing', score: 0 });

  isRolling = signal(false);

  isLastRound = computed(() => this.gameService.isLastRound());

  isActionDisabled = computed(
    () =>
      this.state().roundState.rollsLeft === 3 ||
      this.state().roundState.isComplete ||
      this.isRolling(),
  );

  isRollDisabled = computed(
    () =>
      this.state().roundState.rollsLeft === 0 ||
      this.state().roundState.isComplete ||
      this.isRolling(),
  );

  canFinishRound = computed(() => !this.state().roundState.isComplete && !this.isRolling());

  constructor() {
    afterNextRender(() => {
      if (this.state().roundState.dice.length === 0) {
        void this.router.navigate(['/home']);
      }
      console.log(this.state());
    });
  }

  roll(): void {
    if (this.isRollDisabled()) return;
    this.isRolling.set(true);

    timer(600)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const currentState = this.state();
        const newDice = this.gameService.rollDice(currentState.roundState.dice);
        const hand = this.gameService.evaluateHand(newDice);

        this.currentHand.set(hand);

        this.gameService.updateRoundState({
          dice: newDice,
          rollsLeft: currentState.roundState.rollsLeft - 1,
          currentScore: hand.score,
        });

        this.isRolling.set(false);
      });
  }

  toggleHold(die: DiceRoll): void {
    if (this.isActionDisabled()) return;

    const updatedDice = this.state().roundState.dice.map((d) =>
      d.id === die.id ? { ...d, isHeld: !d.isHeld } : d,
    );

    this.gameService.updateRoundState({ dice: updatedDice });
  }

  finishRound(): void {
    const hand = this.gameService.evaluateHand(this.state().roundState.dice);
    this.currentHand.set(hand);
    this.gameService.completeRound(hand.score);
  }

  nextRound(): void {
    if (this.isLastRound()) {
      this.gameService.saveHighScore(this.state().totalScore);
      void this.router.navigate(['/results'], {
        queryParams: { score: this.state().totalScore },
      });
      return;
    }

    this.gameService.startNextRound();
    this.currentHand.set({ name: 'Nothing', score: 0 });
  }
}
