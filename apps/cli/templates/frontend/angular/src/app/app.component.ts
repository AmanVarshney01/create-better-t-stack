import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { HeaderComponent } from '../components/header/header.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    NgxSonnerToaster
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header />
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <ngx-sonner-toaster richColors closeButton position="top-right" />
    </div>
  `,
})
export class AppComponent {
 private themeService = inject(ThemeService);
  constructor() {
    this.themeService.initTheme();
  }
}
