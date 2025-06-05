import {
	type ApplicationConfig,
	provideZoneChangeDetection,
} from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";

// import { provideTrpcClient } from "./utils/trpc-client";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
	QueryClient,
	provideTanStackQuery,
	withDevtools,
} from "@tanstack/angular-query-experimental";
import { routes } from "./app.routes";

import type {
	HttpHandlerFn,
	HttpInterceptorFn,
	HttpRequest,
} from "@angular/common/http";

const withCredentialsInterceptor: HttpInterceptorFn = (
	req: HttpRequest<unknown>,
	next: HttpHandlerFn,
) => {
	const modifiedReq = req.clone({
		withCredentials: true,
	});
	return next(modifiedReq);
};
export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideAnimations(),
		provideHttpClient(withInterceptors([withCredentialsInterceptor])),
		// provideTrpcClient(),
		provideTanStackQuery(
			new QueryClient(),
			withDevtools(() => ({ loadDevtools: "auto" })),
		),
	],
};
