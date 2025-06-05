import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
 selector: 'app-header',
 standalone: true,
 imports: [CommonModule, RouterLink, RouterLinkActive],
 template: `
    <header class="bg-white dark:bg-black shadow-xs sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <nav class="flex space-x-6">
          <a
            routerLink="/"
            routerLinkActive="text-primary-600 dark:text-primary-400"
            [routerLinkActiveOptions]="{exact: true}"
            class="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Home
          </a>
          <a
            routerLink="/todos"
            routerLinkActive="text-primary-600 dark:text-primary-400"
            class="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Todos
          </a>
          <a
            *ngIf="isAuthenticated$ | async"
            routerLink="/dashboard"
            routerLinkActive="text-primary-600 dark:text-primary-400"
            class="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Dashboard
          </a>
          <a
            routerLink="/ai-chat"
            routerLinkActive="text-primary-600 dark:text-primary-400"
            class="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            AI Chat
          </a>
        </nav>

        <div class="flex items-center space-x-4">
          <div class="relative">
            <button
              (click)="toggleThemeMenu()"
              class="icon-btn"
              aria-label="Toggle theme"
            >
              <svg *ngIf="darkMode$ | async" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg *ngIf="!(darkMode$ | async)" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>

            <div
              *ngIf="showThemeMenu"
              class="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
            >
              <button
                (click)="setTheme('light')"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Light
              </button>
              <button
                (click)="setTheme('dark')"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Dark
              </button>
              <button
                (click)="setTheme('system')"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                System
              </button>
            </div>
          </div>

          <ng-container *ngIf="!(isAuthenticated$ | async); else profileMenu">
            <a
              routerLink="/login"
              class="btn btn-primary text-sm"
            >
              Sign In
            </a>
          </ng-container>

          <ng-template #profileMenu>
            <div class="relative">
              <button
                (click)="toggleProfileMenu()"
                class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white">
                  {{ userInitial }}
                </div>
                <span class="font-medium">{{ authService.user()?.name }}</span>
              </button>

              <div
                *ngIf="showProfileMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
              >
                <div class="px-4 py-2 text-sm">
                  <div class="font-medium">{{ this.authService.user()?.name }}</div>
                  <div class="text-gray-500 dark:text-gray-400 text-xs">{{ this.authService.user()?.email }}</div>
                </div>
                <div class="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  (click)="logout()"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
 private themeService = inject(ThemeService);
 public authService = inject(AuthService);

 darkMode$ = this.themeService.darkMode$;
 isAuthenticated$ = this.authService.isAuthenticated$;
 showProfileMenu = false;
 showThemeMenu = false;

 get userInitial(): string {
  return this.authService.user()?.name?.charAt(0) ?? '';
 }

 toggleThemeMenu(): void {
  this.showThemeMenu = !this.showThemeMenu;
  if (this.showThemeMenu) {
   this.showProfileMenu = false;
  }
 }

 setTheme(mode: 'light' | 'dark' | 'system'): void {
  this.themeService.setTheme(mode);
  this.showThemeMenu = false;
 }

 toggleProfileMenu(): void {
  this.showProfileMenu = !this.showProfileMenu;
  if (this.showProfileMenu) {
   this.showThemeMenu = false;
  }
 }

 logout(): void {
  this.showProfileMenu = false;
  this.authService.logout();
 }
}
