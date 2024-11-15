import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../shared/lib/services/storage.service';
import { GameService } from '../../shared/lib/services/game.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  private readonly router = inject(Router);

  private readonly gameService = inject(GameService);

  private readonly storageService = inject(StorageService);

  roundOptions = signal([1, 3, 5, 10, 15]);

  selectedRounds = signal(1);

  scoringCombos = [
    { name: 'Five of a Kind', points: 50, example: 'All five dice showing same number' },
    { name: 'Four of a Kind', points: 40, example: 'Four dice showing same number' },
    { name: 'Full House', points: 30, example: 'Three of one number, two of another' },
    { name: 'Three of a Kind', points: 20, example: 'Three dice showing same number' },
    { name: 'Two Pair', points: 15, example: 'Two different pairs' },
    { name: 'One Pair', points: 10, example: 'Two dice showing same number' },
    { name: 'High Dice', points: '1-6', example: 'Points equal to highest die' },
    { name: 'Nothing', points: 0, example: 'No matching dice' },
    { name: 'Small Straight', points: 30, example: '1-2-3-4-5' },
    { name: 'Big Straight', points: 40, example: '2-3-4-5-6' },
  ];

  startGame(rounds: number): void {
    this.gameService.initializeGame(rounds);
    void this.router.navigate(['/game']);
  }

  getHighScore(): number {
    return Number(this.storageService.getItem('dicePokerHighScore')) || 0;
  }
}
