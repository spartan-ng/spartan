import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TRPCClientError, createTRPCClient, type TRPCClientRuntime } from '@trpc/client';
import { initTRPC } from '@trpc/server';
import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { angularHttpLink } from './angular-http-link';

const t = initTRPC.create();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRouter = t.router({
	hello: t.procedure.query(() => 'Hello'),
	echo: t.procedure.query(({ input }) => input),
	updateUser: t.procedure.mutation(({ input }) => input),
});
type AppRouter = typeof appRouter;

describe('angularHttpLink', () => {
	let httpClient: HttpClient;
	let httpTesting: HttpTestingController;
	const waitForRequestScheduling = () => new Promise<void>((resolve) => queueMicrotask(resolve));
	const baseUrl = 'http://localhost:3000/trpc';
	const createClient = (opts?: Parameters<typeof angularHttpLink<AppRouter>>[0]) =>
		createTRPCClient<AppRouter>({
			links: [
				angularHttpLink({
					url: baseUrl,
					httpClient,
					...(opts ?? {}),
				}),
			],
		});
	const createErrorResponse = (
		code: keyof typeof TRPC_ERROR_CODES_BY_KEY,
		status: number,
		message: string,
	) => ({
		error: {
			code: TRPC_ERROR_CODES_BY_KEY[code],
			message,
			data: {
				code,
				httpStatus: status,
			},
		},
	});
	const createRuntime = (): TRPCClientRuntime => ({
		transformer: {
			serialize: (data) => data,
			deserialize: (data) => data,
		},
		combinedTransformer: {
			input: {
				serialize: (data) => data,
				deserialize: (data) => data,
			},
			output: {
				serialize: (data) => data,
				deserialize: (data) => data,
			},
		},
	});
	const subscribeForResult = (source$: { subscribe: (observer: { next: (value: unknown) => void; error: (error: unknown) => void }) => unknown }) =>
		new Promise((resolve, reject) => {
			source$.subscribe({
				next: resolve,
				error: reject,
			});
		});
	const executeLinkQuery = (signal?: AbortSignal) => {
		const operationLink = angularHttpLink<AppRouter>({
			url: baseUrl,
			httpClient,
		})(createRuntime());

		return operationLink({
			op: {
				id: 1,
				type: 'query',
				path: 'hello',
				input: undefined,
				context: {},
				signal,
			} as never,
			next: () => {
				throw new Error('next should not be called for angularHttpLink');
			},
		});
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		httpClient = TestBed.inject(HttpClient);
		httpTesting = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTesting.verify();
	});

	it('uses GET for query procedures', async () => {
		const client = createClient();

		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		expect(req.request.method).toBe('GET');

		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});

	it('uses POST for mutation procedures', async () => {
		const client = createClient();

		const response = client.mutation('updateUser', { id: 1, name: 'Spartan' });
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/updateUser`);
		expect(req.request.method).toBe('POST');
		expect(req.request.body).toBe(JSON.stringify({ id: 1, name: 'Spartan' }));
		expect(req.request.headers.get('Content-Type')).toBe('application/json');

		req.flush({ result: { data: { id: 1, name: 'Spartan' } } });
		await expect(response).resolves.toEqual({ id: 1, name: 'Spartan' });
	});

	it('uses POST for query procedures when methodOverride is set', async () => {
		const client = createClient({
			url: baseUrl,
			httpClient,
			methodOverride: 'POST',
		});

		const response = client.query('echo', { id: 7 });
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/echo`);
		expect(req.request.method).toBe('POST');
		expect(req.request.body).toBe(JSON.stringify({ id: 7 }));

		req.flush({ result: { data: { id: 7 } } });
		await expect(response).resolves.toEqual({ id: 7 });
	});

	it('handles static headers', async () => {
		const client = createClient({
			url: baseUrl,
			httpClient,
			headers: {
				Authorization: 'Bearer static-token',
			},
		});

		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		expect(req.request.headers.get('Authorization')).toBe('Bearer static-token');

		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});

	it('handles sync function headers', async () => {
		const client = createClient({
			url: baseUrl,
			httpClient,
			headers: ({ op }) => ({
				'X-Procedure': op.path,
			}),
		});

		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		expect(req.request.headers.get('X-Procedure')).toBe('hello');

		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});

	it('handles async function headers', async () => {
		const client = createClient({
			url: baseUrl,
			httpClient,
			headers: async () => ({
				'X-Async': 'true',
			}),
		});

		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		expect(req.request.headers.get('X-Async')).toBe('true');

		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});

	it('serializes array header values', async () => {
		const client = createClient({
			url: baseUrl,
			httpClient,
			headers: {
				'x-list': ['alpha', 'beta'],
			},
		});

		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		expect(req.request.headers.get('x-list')).toBe('alpha, beta');

		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});

	it('maps BAD_REQUEST errors (400)', async () => {
		const client = createClient();
		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		req.flush(createErrorResponse('BAD_REQUEST', 400, 'Bad request'), {
			status: 400,
			statusText: 'Bad Request',
		});

		await expect(response).rejects.toMatchObject({
			data: { code: 'BAD_REQUEST', httpStatus: 400 },
		});
	});

	it('maps UNAUTHORIZED errors (401)', async () => {
		const client = createClient();
		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		req.flush(createErrorResponse('UNAUTHORIZED', 401, 'Unauthorized'), {
			status: 401,
			statusText: 'Unauthorized',
		});

		await expect(response).rejects.toMatchObject({
			data: { code: 'UNAUTHORIZED', httpStatus: 401 },
		});
	});

	it('maps NOT_FOUND errors (404)', async () => {
		const client = createClient();
		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		req.flush(createErrorResponse('NOT_FOUND', 404, 'Missing procedure'), {
			status: 404,
			statusText: 'Not Found',
		});

		await expect(response).rejects.toMatchObject({
			data: { code: 'NOT_FOUND', httpStatus: 404 },
		});
	});

	it('maps INTERNAL_SERVER_ERROR errors (500)', async () => {
		const client = createClient();
		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		req.flush(createErrorResponse('INTERNAL_SERVER_ERROR', 500, 'Internal failure'), {
			status: 500,
			statusText: 'Internal Server Error',
		});

		await expect(response).rejects.toMatchObject({
			data: { code: 'INTERNAL_SERVER_ERROR', httpStatus: 500 },
		});
	});

	it('handles HTTP 200 response containing a tRPC error', async () => {
		const client = createClient();
		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		req.flush(createErrorResponse('BAD_REQUEST', 400, 'validation failed'), {
			status: 200,
			statusText: 'OK',
		});

		await expect(response).rejects.toMatchObject({
			data: { code: 'BAD_REQUEST', httpStatus: 400 },
		});
	});

	it('handles network connection errors', async () => {
		const client = createClient();
		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		req.error(new ProgressEvent('error'));

		await expect(response).rejects.toBeInstanceOf(TRPCClientError);
	});

	it('handles timeout responses (408)', async () => {
		const client = createClient();
		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		req.flush(createErrorResponse('TIMEOUT', 408, 'timeout'), {
			status: 408,
			statusText: 'Request Timeout',
		});

		await expect(response).rejects.toMatchObject({
			data: { code: 'TIMEOUT', httpStatus: 408 },
		});
	});

	it('handles AbortSignal cancellation', async () => {
		const abortController = new AbortController();
		const response = subscribeForResult(executeLinkQuery(abortController.signal));
		await waitForRequestScheduling();

		httpTesting.expectOne(`${baseUrl}/hello`);
		abortController.abort();

		await expect(response).rejects.toBeInstanceOf(TRPCClientError);
	});

	it('handles pre-aborted signal', async () => {
		const abortController = new AbortController();
		abortController.abort();

		const response = subscribeForResult(executeLinkQuery(abortController.signal));
		await expect(response).rejects.toBeInstanceOf(TRPCClientError);
		httpTesting.expectNone(`${baseUrl}/hello`);
	});

	it('preserves response meta in error responses', async () => {
		const client = createClient();
		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		req.flush(createErrorResponse('UNAUTHORIZED', 401, 'Unauthorized'), {
			status: 401,
			statusText: 'Unauthorized',
		});

		const error = (await response.catch((cause) => cause)) as TRPCClientError<AppRouter>;
		expect(error).toBeInstanceOf(TRPCClientError);
		expect((error.meta as { response?: { status?: number; statusText?: string } }).response?.status).toBe(401);
		expect((error.meta as { response?: { status?: number; statusText?: string } }).response?.statusText).toBe(
			'Unauthorized',
		);
	});

	it('handles non-JSON error responses from proxies/gateways', async () => {
		const client = createClient();
		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		req.flush('upstream proxy failed', {
			status: 502,
			statusText: 'Bad Gateway',
		});

		await expect(response).rejects.toBeInstanceOf(TRPCClientError);
	});

	it('handles empty error responses', async () => {
		const client = createClient();
		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		req.flush(null, {
			status: 503,
			statusText: 'Service Unavailable',
		});

		await expect(response).rejects.toBeInstanceOf(TRPCClientError);
	});

	it('normalizes trailing slashes in URL', async () => {
		const client = createTRPCClient<AppRouter>({
			links: [
				angularHttpLink({
					url: `${baseUrl}/`,
					httpClient,
				}),
			],
		});

		const response = client.query('hello');
		await waitForRequestScheduling();

		const req = httpTesting.expectOne(`${baseUrl}/hello`);
		expect(req.request.method).toBe('GET');

		req.flush({ result: { data: 'Hello' } });
		await expect(response).resolves.toBe('Hello');
	});
});
