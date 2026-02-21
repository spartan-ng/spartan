# tRPC

Spartan tRPC integration (client + server) for Analog/Nitro and Angular.

Learn more at [spartan.ng](https://spartan.ng)

## Client (fetch + batch)

```ts
import { createTrpcClient } from '@spartan-ng/trpc';
import superjson from 'superjson';
import type { AppRouter } from './server/trpc/routers';

export const { provideTrpcClient, tRPCClient, TrpcHeaders } = createTrpcClient<AppRouter>({
	url: '/api/trpc',
	options: {
		transformer: superjson,
	},
});
```

## Client (Angular HttpClient link)

Use this when you want Angular HttpClient features (interceptors, custom backends).
`transportLink` can be a factory so you can call `inject()` inside the provider
context.

```ts
import { inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { createAngularTrpcClient } from '@spartan-ng/trpc';
import type { AppRouter } from './server/trpc/routers';
import superjson from 'superjson';

export const { TrpcClient, provideAngularTrpcClient, TrpcHeaders } = createAngularTrpcClient<AppRouter>({
	url: '/api/trpc',
	options: {
		transformer: superjson,
	},
});

export const appConfig = {
	providers: [provideHttpClient(), provideAngularTrpcClient()],
};
```

`createAngularTrpcClient` defaults to `useTransferStateLink: false` to avoid
double caching when using Angular's HttpClient transfer cache. Set it to `true`
only if you're not using the HttpClient transfer cache.

Use `TrpcHeaders.update(...)` to set auth headers; they are merged with any
static or dynamic `headers` passed to `createAngularTrpcClient`.

## Server (Nitro route)

```ts
import { createTrpcNitroHandler } from '@spartan-ng/trpc';
import { appRouter } from './trpc/routers';
import { createContext } from './trpc/context';

export default createTrpcNitroHandler({
	router: appRouter,
	createContext,
});
```
