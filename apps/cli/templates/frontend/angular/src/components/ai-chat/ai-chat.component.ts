import { Component, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/enviroments';

@Component({
 selector: 'app-ai-chat',
 standalone: true,
 imports: [CommonModule, FormsModule],
 template: `
    <div class="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div class="container mx-auto px-4 py-8">
        <!-- Chat Messages -->
        <div class="bg-white dark:bg-[#111111] rounded-lg border border-gray-200 dark:border-gray-800 mb-4 h-[calc(100vh-12rem)] overflow-y-auto">
          <div class="p-4">
            <div class="text-center text-gray-600 dark:text-gray-400">
              Ask me anything to get started!
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="bg-white dark:bg-[#111111] rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div class="flex gap-2">
            <input
              type="text"
              [(ngModel)]="message"
              (keyup.enter)="sendMessage()"
              class="flex-1 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-hidden focus:border-primary-500"
              placeholder="Type your message..."
            />
            <button
              (click)="sendMessage()"
              class="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AIChatComponent {
 message = '';
 decoder = new TextDecoder();
 characters = resource({
  stream: async () => {
   const data = signal<{ value: string; } | { error: unknown; }>({
    value: "",
   });
   fetch(environment.baseUrl).then(async (response) => {
    if (!response.body) return;
    for await (const chunk of response.body) {
     const chunkText = this.decoder.decode(chunk);
     data.update((prev) => {
      if ("value" in prev) {
       return { value: `${prev.value} ${chunkText}` };
      } else {
       return { error: chunkText };
      }
     });
    }
   });
   return data;
  },
 });
 sendMessage() {
  if (this.message.trim()) {
   console.log('Sending message:', this.message);
   this.message = '';
  }
 }
}
