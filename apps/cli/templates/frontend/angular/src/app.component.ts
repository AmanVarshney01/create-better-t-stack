import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { HeaderComponent } from './components/header/header.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    NgxSonnerToaster
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
 private themeService = inject(ThemeService);
  constructor() {
    this.themeService.initTheme();
  }
}
