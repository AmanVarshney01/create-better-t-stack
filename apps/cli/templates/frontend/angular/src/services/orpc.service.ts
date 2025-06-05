// import { Injectable } from '@angular/core';
// import { createORPCClient } from "@orpc/client";
// import { RPCLink } from "@orpc/client/fetch";
// import { QueryCache, QueryClient } from '@tanstack/angular-query-experimental';
// import { toast } from 'ngx-sonner';
// import { appRouter, AppRouter } from '../../../server/src/routers';
// import { environment } from '../environments/enviroments';
// import type { RouterClient } from "@orpc/server";


// @Injectable({
//  providedIn: 'root'
// })
// export class ORPCService {
//  private queryClient = new QueryClient({
//   queryCache: new QueryCache({
//    onError: (error) => {
//     toast.error(`Error: ${error.message}`, {
//      action: {
//       label: "retry",
//       onClick: () => {
//        this.queryClient.invalidateQueries();
//       },
//      },
//     });
//    },
//   }),
//  });

//  private link = new RPCLink({
//   url: `${environment.baseUrl}/rpc`,
//   fetch(url, options) {
//    return fetch(url, {
//     ...options,
//     credentials: "include",
//    });
//   },
//  });

//  private client: RouterClient<typeof appRouter> = createORPCClient(this.link);

//  getQueryClient(): QueryClient {
//   return this.queryClient;
//  }
// }
