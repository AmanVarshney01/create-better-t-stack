import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();
  private themeMode = new BehaviorSubject<'light' | 'dark' | 'system'>('system');
  themeMode$ = this.themeMode.asObservable();

  constructor() {
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        if (this.themeMode.value === 'system') {
          this.updateTheme(e.matches);
        }
      });
  }

  initTheme(): void {
    const savedTheme = localStorage.getItem('themeMode') as 'light' | 'dark' | 'system' || 'system';
    this.setTheme(savedTheme);
  }

  setTheme(mode: 'light' | 'dark' | 'system'): void {
    this.themeMode.next(mode);
    localStorage.setItem('themeMode', mode);

    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.updateTheme(systemDark);
    } else {
      this.updateTheme(mode === 'dark');
    }
  }

  private updateTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.darkMode.next(isDark);
  }
}
