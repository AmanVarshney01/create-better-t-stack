import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
        <h2 class="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          routerLink="/"
          class="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
