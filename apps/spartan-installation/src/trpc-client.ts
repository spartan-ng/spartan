import { createTrpcClient } from '@analogjs/trpc';
import { inject } from '@angular/core';
import { SuperJSON } from 'superjson';
import { AppRouter } from './server/trpc/routers';

export const { provideTrpcClient, TrpcClient } = createTrpcClient<AppRouter>({
	url: '/api/trpc',
	options: {
		transformer: SuperJSON,
	},
});

export function injectTrpcClient() {
	return inject(TrpcClient);
}
