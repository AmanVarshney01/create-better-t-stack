import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
}
