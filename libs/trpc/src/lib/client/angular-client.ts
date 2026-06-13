import { HttpClient } from '@angular/common/http';
import { InjectionToken, type Provider, inject } from '@angular/core';
import { type CreateTRPCClientOptions, type TRPCLink } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';
import { angularHttpLink } from './links/angular-http-link';
import { createTRPCRxJSProxyClient } from './trpc-rxjs-proxy';

// Angular HttpClient-based client factory.
export type AngularTrpcClientOptions<T extends AnyRouter> = {
	url: string | URL;
	options?: Partial<CreateTRPCClientOptions<T>>;
	methodOverride?: 'POST';
};

export type AngularTrpcClient<AppRouter extends AnyRouter> = ReturnType<typeof createTRPCRxJSProxyClient<AppRouter>>;
const TRPC_ANGULAR_INJECTION_TOKEN = new InjectionToken<unknown>('@spartan-ng/trpc angular proxy client');

export const createAngularTrpcClient = <AppRouter extends AnyRouter>({
	url,
	options,
	methodOverride,
}: AngularTrpcClientOptions<AppRouter>) => {
	const provideAngularTrpcClient = (): Provider[] => [
		{
			provide: TRPC_ANGULAR_INJECTION_TOKEN,
			useFactory: () => {
				const httpClient = inject(HttpClient);

				const links: TRPCLink<AppRouter>[] = [...(options?.links ?? [])];
				links.push(
					angularHttpLink({
						url,
						httpClient,
						methodOverride,
					}),
				);

				const clientOptions = {
					transformer: options?.transformer,
					links,
				} as Parameters<typeof createTRPCRxJSProxyClient<AppRouter>>[0];

				return createTRPCRxJSProxyClient<AppRouter>(clientOptions);
			},
		},
	];

	const TrpcClient = TRPC_ANGULAR_INJECTION_TOKEN as InjectionToken<AngularTrpcClient<AppRouter>>;
	return {
		TrpcClient,
		provideAngularTrpcClient,
		/** @deprecated use TrpcClient instead */
		tRPCClient: TrpcClient,
		/** @deprecated use provideAngularTrpcClient instead */
		provideTRPCClient: provideAngularTrpcClient,
	};
};

export default createAngularTrpcClient;
