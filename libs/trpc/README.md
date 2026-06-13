# tRPC

Spartan tRPC integration (client + server) for Analog/Nitro and Angular.

Learn more at [spartan.ng](https://spartan.ng)

## Client (Angular HttpClient - default)

```ts
import { provideHttpClient } from '@angular/common/http';
import { createTrpcClient } from '@spartan-ng/trpc';
import superjson from 'superjson';
import type { AppRouter } from './server/trpc/routers';

export const { provideTrpcClient, tRPCClient } = createTrpcClient<AppRouter>({
	url: '/api/trpc',
	options: {
		transformer: superjson,
	},
});

export const appConfig = {
	providers: [provideHttpClient(), provideTrpcClient()],
};
```

`createTrpcClient` uses Angular `HttpClient` transport via `angularHttpLink`.
It supports Angular interceptors and custom backends out of the box.

Use Angular `HttpClient` interceptors to add auth and contextual headers.

## Legacy alias (`createAngularTrpcClient`)

`createAngularTrpcClient` is still exported for compatibility. It uses the same
HttpClient-based transport model.

```ts
import { provideHttpClient } from '@angular/common/http';
import { createAngularTrpcClient } from '@spartan-ng/trpc';
import type { AppRouter } from './server/trpc/routers';
import superjson from 'superjson';

export const { TrpcClient, provideAngularTrpcClient } = createAngularTrpcClient<AppRouter>({
	url: '/api/trpc',
	options: {
		transformer: superjson,
	},
});

export const appConfig = {
	providers: [provideHttpClient(), provideAngularTrpcClient()],
};
```

See [MIGRATION.md](./MIGRATION.md) for upgrading from the previous fetch/batch client behavior.

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
