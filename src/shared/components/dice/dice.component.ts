import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DiceRoll, DotPosition } from '../../lib/types/game.types';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss',
})
export class DiceComponent {
  dice = input.required<DiceRoll>();

  disabled = input(false);

  isRolling = input(false);

  onDiceClick = output<void>();

  dots = computed(() => {
    const value = this.dice().value;
    const dotPositions: DotPosition[] = [];

    switch (value) {
      case 1:
        dotPositions.push({ id: 0, class: 'row-start-2 col-start-2 place-self-center' });
        break;
      case 2:
        dotPositions.push(
          { id: 0, class: 'row-start-1 col-start-3 place-self-center' },
          { id: 1, class: 'row-start-3 col-start-1 place-self-center' },
        );
        break;
      case 3:
        dotPositions.push(
          { id: 0, class: 'row-start-1 col-start-3 place-self-center' },
          { id: 1, class: 'row-start-2 col-start-2 place-self-center' },
          { id: 2, class: 'row-start-3 col-start-1 place-self-center' },
        );
        break;
      case 4:
        dotPositions.push(
          { id: 0, class: 'row-start-1 col-start-1 place-self-center' },
          { id: 1, class: 'row-start-1 col-start-3 place-self-center' },
          { id: 2, class: 'row-start-3 col-start-1 place-self-center' },
          { id: 3, class: 'row-start-3 col-start-3 place-self-center' },
        );
        break;
      case 5:
        dotPositions.push(
          { id: 0, class: 'row-start-1 col-start-1 place-self-center' },
          { id: 1, class: 'row-start-1 col-start-3 place-self-center' },
          { id: 2, class: 'row-start-2 col-start-2 place-self-center' },
          { id: 3, class: 'row-start-3 col-start-1 place-self-center' },
          { id: 4, class: 'row-start-3 col-start-3 place-self-center' },
        );
        break;
      case 6:
        dotPositions.push(
          { id: 0, class: 'row-start-1 col-start-1 place-self-center' },
          { id: 1, class: 'row-start-1 col-start-3 place-self-center' },
          { id: 2, class: 'row-start-2 col-start-1 place-self-center' },
          { id: 3, class: 'row-start-2 col-start-3 place-self-center' },
          { id: 4, class: 'row-start-3 col-start-1 place-self-center' },
          { id: 5, class: 'row-start-3 col-start-3 place-self-center' },
        );
        break;
    }

    return dotPositions;
  });

  getDiceClasses(): string {
    return [
      'bg-white',
      this.dice().isHeld ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50',
      this.isRolling() ? 'rolling' : '',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
