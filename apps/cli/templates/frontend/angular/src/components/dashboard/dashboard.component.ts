import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="card w-full max-w-4xl mx-auto animate-fade-in">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-2xl font-bold mb-1">Dashboard</h2>
              <p class="text-gray-600 dark:text-gray-400">Welcome to your private dashboard</p>
            </div>
            <button 
              (click)="logout()"
              class="btn btn-secondary"
            >
              Logout
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <h3 class="text-lg font-semibold mb-2">Statistics</h3>
              <p class="text-gray-600 dark:text-gray-400">Your activity overview</p>
            </div>
            
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <h3 class="text-lg font-semibold mb-2">Recent Activity</h3>
              <p class="text-gray-600 dark:text-gray-400">Your latest actions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}