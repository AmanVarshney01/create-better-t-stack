import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trpcService } from 'src/services/trpc.service';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';

@Component({
 selector: 'app-home',
 standalone: true,
 imports: [CommonModule, RouterLink],
 template: `
    <div class="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div class="container mx-auto px-4 py-12">
        <pre className="overflow-x-auto font-mono text-sm">
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 </pre>
        <!-- API Status -->
        <div class="bg-white dark:bg-[#111111] rounded-lg p-6 mb-12 border border-gray-200 dark:border-gray-800">
          <h2 class="text-xl font-medium mb-4">API Status</h2>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
            <span class="text-gray-700 dark:text-gray-300">
             {{query.isSuccess() ? 'Connected' : 'Disconnected'}}
            </span>
          </div>
        </div>

        <!-- Core Features -->
        <div class="mb-12">
          <h2 class="text-2xl font-medium mb-8">Core Features</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Type-Safe API -->
            <div class="bg-white dark:bg-[#111111] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 class="text-lg font-medium mb-1">Type-Safe API</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">End-to-end type safety with tRPC</p>
            </div>

            <!-- Modern React -->
            <div class="bg-white dark:bg-[#111111] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 class="text-lg font-medium mb-1">Modern React</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">TanStack Router + TanStack Query</p>
            </div>

            <!-- Fast Backend -->
            <div class="bg-white dark:bg-[#111111] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 class="text-lg font-medium mb-1">Fast Backend</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">Lightweight Hono server</p>
            </div>

            <!-- Beautiful UI -->
            <div class="bg-white dark:bg-[#111111] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 class="text-lg font-medium mb-1">Beautiful UI</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">TailwindCSS + shadcn/ui components</p>
            </div>
          </div>
        </div>

        <!-- Demo Button -->
        <div class="text-center">
          <a
            routerLink="/todos"
            class="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
          >
            <span>View Todo Demo</span>
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  `,
 styles: []
})
export class HomeComponent {
 private trpcService = inject(trpcService);
 query = injectQuery(() => ({
  queryKey: ['healthCheck'],
  queryFn: () => this.trpcService.proxy.healthCheck.query(),
 }));

}
