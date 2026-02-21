import { HttpClient } from '@angular/common/http';
import { InjectionToken, type Provider, inject, signal } from '@angular/core';
import { type CreateTRPCClientOptions, type HTTPHeaders, type Operation, type TRPCLink } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';
import { angularHttpLink } from './links/angular-http-link';
import { createTRPCRxJSProxyClient } from './trpc-rxjs-proxy';
import { transferStateLink } from './links/transfer-state-link';
import { provideTrpcCacheState, provideTrpcCacheStateStatusManager } from './cache-state';

// Angular-first wrapper around angularHttpLink to keep the fetch/batch client untouched.
export type AngularTrpcClientOptions<T extends AnyRouter> = {
	url: string | URL;
	options?: Partial<CreateTRPCClientOptions<T>>;
	/**
	 * Additional headers merged on top of TrpcHeaders (explicit values win).
	 */
	headers?: HTTPHeaders | ((opts: { op: Operation }) => HTTPHeaders | Promise<HTTPHeaders>);
	methodOverride?: 'POST';
	/**
	 * Defaults to false to avoid double caching with HttpClient transfer cache.
	 */
	useTransferStateLink?: boolean;
};

export type AngularTrpcClient<AppRouter extends AnyRouter> = ReturnType<typeof createTRPCRxJSProxyClient<AppRouter>>;
const TRPC_ANGULAR_INJECTION_TOKEN = new InjectionToken<unknown>('@spartan-ng/trpc angular proxy client');

export const createAngularTrpcClient = <AppRouter extends AnyRouter>({
	url,
	options,
	headers,
	methodOverride,
	useTransferStateLink,
}: AngularTrpcClientOptions<AppRouter>) => {
	const TrpcHeaders = signal<HTTPHeaders>({});
	const shouldUseTransferStateLink = useTransferStateLink ?? false;
	const provideAngularTrpcClient = (): Provider[] => [
		...(shouldUseTransferStateLink
			? [provideTrpcCacheState(), provideTrpcCacheStateStatusManager()]
			: []),
		{
			provide: TRPC_ANGULAR_INJECTION_TOKEN,
			useFactory: () => {
				const httpClient = inject(HttpClient);
				const resolveHeaders = async ({ op }: { op: Operation }) => {
					const baseHeaders = TrpcHeaders();
					if (!headers) {
						return baseHeaders;
					}
					const extraHeaders = typeof headers === 'function' ? await headers({ op }) : headers;
					return {
						...baseHeaders,
						...extraHeaders,
					};
				};

				const links: TRPCLink<AppRouter>[] = [...(options?.links ?? [])];
				if (shouldUseTransferStateLink) {
					links.push(transferStateLink());
				}
				links.push(
					angularHttpLink({
						url,
						httpClient,
						headers: resolveHeaders,
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
		TrpcHeaders,
		/** @deprecated use TrpcClient instead */
		tRPCClient: TrpcClient,
		/** @deprecated use provideAngularTrpcClient instead */
		provideTRPCClient: provideAngularTrpcClient,
		/** @deprecated use TrpcHeaders instead */
		tRPCHeaders: TrpcHeaders,
	};
};

export default createAngularTrpcClient;
