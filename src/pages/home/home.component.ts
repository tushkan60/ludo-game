import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../entities/header/header.component';
import { FooterComponent } from '../../entities/footer/footer.component';
import { WelcomeComponent } from '../../widgets/welcome/welcome.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent, WelcomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
