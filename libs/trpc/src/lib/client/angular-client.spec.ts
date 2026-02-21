import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { initTRPC } from '@trpc/server';
import { firstValueFrom } from 'rxjs';
import { afterEach, describe, expect, it } from 'vitest';
import { createAngularTrpcClient } from './angular-client';
import { tRPC_CACHE_STATE } from './cache-state';

const t = initTRPC.create();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRouter = t.router({
	hello: t.procedure.query(() => 'Hello'),
});
type AppRouter = typeof appRouter;

describe('createAngularTrpcClient', () => {
	let httpTesting: HttpTestingController;
	const waitForRequestScheduling = () => new Promise<void>((resolve) => queueMicrotask(resolve));

	afterEach(() => {
		httpTesting?.verify();
	});

	it('merges TrpcHeaders with custom header callbacks and callback precedence', async () => {
		const { TrpcClient, TrpcHeaders, provideAngularTrpcClient } = createAngularTrpcClient<AppRouter>({
			url: 'http://localhost:3000/trpc',
			headers: ({ op }) => ({
				Authorization: `Bearer callback-${op.path}`,
				'X-Op-Path': op.path,
			}),
		});

		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting(), ...provideAngularTrpcClient()],
		});
		httpTesting = TestBed.inject(HttpTestingController);
		const client = TestBed.inject(TrpcClient);

		TrpcHeaders.update((headers) => ({
			...headers,
			Authorization: 'Bearer signal',
		}));

		const response = firstValueFrom(client.hello.query());
		await waitForRequestScheduling();

		const req = httpTesting.expectOne('http://localhost:3000/trpc/hello');
		expect(req.request.headers.get('Authorization')).toBe('Bearer callback-hello');
		expect(req.request.headers.get('X-Op-Path')).toBe('hello');

		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});

	it('defaults useTransferStateLink to false and still resolves requests', async () => {
		const { TrpcClient, provideAngularTrpcClient } = createAngularTrpcClient<AppRouter>({
			url: 'http://localhost:3000/trpc',
		});

		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting(), ...provideAngularTrpcClient()],
		});
		httpTesting = TestBed.inject(HttpTestingController);
		const client = TestBed.inject(TrpcClient);

		expect(() => TestBed.inject(tRPC_CACHE_STATE)).toThrowError();

		const response = firstValueFrom(client.hello.query());
		await waitForRequestScheduling();

		const req = httpTesting.expectOne('http://localhost:3000/trpc/hello');
		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});

	it('provides transfer-state cache providers when useTransferStateLink is true', async () => {
		const { TrpcClient, provideAngularTrpcClient } = createAngularTrpcClient<AppRouter>({
			url: 'http://localhost:3000/trpc',
			useTransferStateLink: true,
		});

		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting(), ...provideAngularTrpcClient()],
		});
		httpTesting = TestBed.inject(HttpTestingController);
		const client = TestBed.inject(TrpcClient);

		expect(TestBed.inject(tRPC_CACHE_STATE)).toBeDefined();

		const response = firstValueFrom(client.hello.query());
		await waitForRequestScheduling();

		const req = httpTesting.expectOne('http://localhost:3000/trpc/hello');
		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});
});
