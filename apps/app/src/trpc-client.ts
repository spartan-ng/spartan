import { inject } from '@angular/core';
import { createTrpcClient } from '@spartan-ng/trpc';
import superjson from 'superjson';
import type { AppRouter } from './server/trpc/routers';

export const { provideTrpcClient, tRPCClient } = createTrpcClient<AppRouter>({
	url: '/api/trpc',
	options: {
		transformer: superjson,
	},
});

export function injectTRPCClient() {
	return inject(tRPCClient);
}
