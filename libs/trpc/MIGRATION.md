# `@spartan-ng/trpc` Migration: `createTrpcClient` -> Angular HttpClient transport

## Summary

`createTrpcClient` now uses Angular `HttpClient` transport (`angularHttpLink`) by
default. The previous fetch + `httpBatchLink` implementation is no longer the
default path.

This change aligns the default client with Angular interceptors/backends and the
new integration work.

## What changed

1. `createTrpcClient` now depends on `HttpClient` and sends requests through
   `angularHttpLink`.
2. `batchLinkOptions` is deprecated and ignored.
3. `useTransferStateLink` has been removed. Transfer state is handled by
   Angular HttpClient facilities.
4. `TrpcHeaders` and `headers` options have been removed from client factories.
5. `createAngularTrpcClient` is still available as a compatibility alias and
   uses the same transport behavior.

## Required app configuration

Ensure `HttpClient` providers are configured before using `provideTrpcClient()`.

```ts
import { provideHttpClient } from '@angular/common/http';
import { createTrpcClient } from '@spartan-ng/trpc';

export const { provideTrpcClient } = createTrpcClient({
	url: '/api/trpc',
});

export const appConfig = {
	providers: [provideHttpClient(), provideTrpcClient()],
};
```

## API notes

### `batchLinkOptions`

`batchLinkOptions` is now deprecated and has no runtime effect. Remove it from
client setup.

### Headers

Use Angular `HttpClient` interceptors for auth and contextual headers.

## Migration checklist

1. Confirm `provideHttpClient(...)` exists in app providers.
2. Remove `batchLinkOptions` from `createTrpcClient(...)`.
3. Remove `useTransferStateLink` from client setup if present.
4. Remove `TrpcHeaders` usage and `headers` options from
   `createTrpcClient(...)` / `createAngularTrpcClient(...)`.
5. Run:
   - `pnpm nx run trpc:lint`
   - `pnpm nx run trpc:test`
   - `pnpm nx run trpc:build:development`
