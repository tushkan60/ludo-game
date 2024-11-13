import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../shared/lib/services/storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);

  private readonly storageService = inject(StorageService);

  scoringCombos = [
    { name: 'Five of a Kind', points: 50, example: 'All five dice showing same number' },
    { name: 'Four of a Kind', points: 40, example: 'Four dice showing same number' },
    { name: 'Full House', points: 30, example: 'Three of one number, two of another' },
    { name: 'Three of a Kind', points: 20, example: 'Three dice showing same number' },
    { name: 'Two Pair', points: 15, example: 'Two different pairs' },
    { name: 'One Pair', points: 10, example: 'Two dice showing same number' },
    { name: 'High Dice', points: '1-6', example: 'Points equal to highest die' },
    { name: 'Nothing', points: 0, example: 'No matching dice' },
  ];

  startGame(): void {
    void this.router.navigate(['/game']);
  }

  getHighScore(): number {
    return Number(this.storageService.getItem('dicePokerHighScore')) || 0;
  }
}
