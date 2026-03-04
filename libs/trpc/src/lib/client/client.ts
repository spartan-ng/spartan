import type { HttpBatchLinkOptions } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';
import { createAngularTrpcClient, type AngularTrpcClient, type AngularTrpcClientOptions } from './angular-client';

export type TrpcOptions<T extends AnyRouter> = AngularTrpcClientOptions<T> & {
	/**
	 * @deprecated `createTrpcClient` now uses `angularHttpLink` and no longer supports batching options.
	 */
	batchLinkOptions?: Omit<HttpBatchLinkOptions, 'url' | 'headers'>;
};

export type TrpcClient<AppRouter extends AnyRouter> = AngularTrpcClient<AppRouter>;

export const createTrpcClient = <AppRouter extends AnyRouter>({
	batchLinkOptions: _batchLinkOptions,
	...angularOptions
}: TrpcOptions<AppRouter>) => {
	const { TrpcClient, provideAngularTrpcClient } = createAngularTrpcClient<AppRouter>(angularOptions);
	const provideTrpcClient = provideAngularTrpcClient;

	return {
		TrpcClient,
		provideTrpcClient,
		/** @deprecated use TrpcClient instead */
		tRPCClient: TrpcClient,
		/** @deprecated use provideTrpcClient instead */
		provideTRPCClient: provideTrpcClient,
	};
};

export default createTrpcClient;
