import { Component } from '@angular/core';
import { HeaderComponent } from '../../entities/header/header.component';
import { FooterComponent } from '../../entities/footer/footer.component';
import { GameFieldComponent } from '../../widgets/game-field/game-field.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, GameFieldComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {}
