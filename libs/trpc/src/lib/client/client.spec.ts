import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { initTRPC } from '@trpc/server';
import { firstValueFrom } from 'rxjs';
import { afterEach, describe, expect, it } from 'vitest';
import { createTrpcClient } from './client';

const t = initTRPC.create();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRouter = t.router({
	hello: t.procedure.query(() => 'Hello'),
});
type AppRouter = typeof appRouter;

describe('createTrpcClient', () => {
	let httpTesting: HttpTestingController;
	const waitForRequestScheduling = () => new Promise<void>((resolve) => queueMicrotask(resolve));

	afterEach(() => {
		httpTesting?.verify();
	});

	it('uses HttpClient transport for queries', async () => {
		const { TrpcClient, provideTrpcClient } = createTrpcClient<AppRouter>({
			url: 'http://localhost:3000/trpc',
		});

		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting(), ...provideTrpcClient()],
		});
		httpTesting = TestBed.inject(HttpTestingController);
		const client = TestBed.inject(TrpcClient);

		const response = firstValueFrom(client.hello.query());
		await waitForRequestScheduling();

		const req = httpTesting.expectOne('http://localhost:3000/trpc/hello');
		expect(req.request.method).toBe('GET');

		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});

	it('ignores deprecated batchLinkOptions and still uses HttpClient transport', async () => {
		const { TrpcClient, provideTrpcClient } = createTrpcClient<AppRouter>({
			url: 'http://localhost:3000/trpc',
			batchLinkOptions: {
				maxURLLength: 20,
			},
		});

		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting(), ...provideTrpcClient()],
		});
		httpTesting = TestBed.inject(HttpTestingController);
		const client = TestBed.inject(TrpcClient);

		const response = firstValueFrom(client.hello.query());
		await waitForRequestScheduling();

		const req = httpTesting.expectOne('http://localhost:3000/trpc/hello');
		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});
});
