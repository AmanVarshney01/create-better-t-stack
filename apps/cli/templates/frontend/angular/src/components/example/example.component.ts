// import { Component, inject } from '@angular/core';
// import { useQuery } from '@tanstack/angular-query';
// import { ORPCService } from '../../services/orpc.service';

// @Component({
//   selector: 'app-example',
//   template: `
//     <div *ngIf="query.isLoading">Loading...</div>
//     <div *ngIf="query.error">Error: {{ query.error }}</div>
//     <div *ngIf="query.data">
//       <!-- Display your data here -->
//       {{ query.data | json }}
//     </div>
//   `
// })
// export class ExampleComponent {
//   private orpcService = inject(ORPCService);
//   private client = this.orpcService.getClient();

//   query = useQuery({
//     queryKey: ['example'],
//     queryFn: () => this.client.example.getData.query(),
//   });
// }
