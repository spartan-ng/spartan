import { HttpErrorResponse, HttpHeaders as AngularHttpHeaders } from '@angular/common/http';
import type { HttpClient } from '@angular/common/http';
import { TRPCClientError, type HTTPHeaders, type Operation, type TRPCClientRuntime, type TRPCLink } from '@trpc/client';
import { transformResult } from '@trpc/client/shared';
import type { AnyRouter, ProcedureType } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { TRPC_ERROR_CODES_BY_KEY, type TRPCResponse } from '@trpc/server/rpc';

// References tRPC v10 client sources: packages/client/src/links/httpLink.ts and httpUtils.ts.
// Error mapping aligns with trpc-angular-main's angularHttpLink behavior (v11), adapted for v10.
export type AngularHttpLinkOptions = {
	url: string | URL;
	httpClient: HttpClient;
	headers?: HTTPHeaders | ((opts: { op: Operation }) => HTTPHeaders | Promise<HTTPHeaders>);
	methodOverride?: 'POST';
};

type HTTPResult = {
	json: TRPCResponse;
	meta: {
		response: {
			status: number;
			statusText: string;
			headers: AngularHttpHeaders;
			url?: string;
			json: () => Promise<unknown>;
			text: () => Promise<string>;
		};
		responseJSON?: unknown;
	};
};

const METHOD: Record<Exclude<ProcedureType, 'subscription'>, 'GET' | 'POST'> = {
	query: 'GET',
	mutation: 'POST',
};

class AbortError extends Error {
	constructor() {
		const name = 'AbortError';
		super(name);
		this.name = name;
		this.message = name;
	}
}

const throwIfAborted = (signal?: AbortSignal) => {
	if (!signal?.aborted) {
		return;
	}
	signal.throwIfAborted?.();
	if (typeof DOMException !== 'undefined') {
		throw new DOMException('AbortError', 'AbortError');
	}
	throw new AbortError();
};

function resolveBaseUrl(url: string | URL): string {
	return url.toString().replace(/\/$/, '');
}

type GetInputOptions = {
	runtime: TRPCClientRuntime;
	input: unknown;
};

function getInput(opts: GetInputOptions) {
	return opts.runtime.transformer.serialize(opts.input);
}

// Mirrors @trpc/client v10 httpUtils getUrl/getBody with methodOverride support.
function getUrl(opts: {
	url: string;
	path: string;
	type: ProcedureType;
	input?: unknown;
	runtime: TRPCClientRuntime;
	methodOverride?: 'POST';
}) {
	let url = `${opts.url}/${opts.path}`;
	const queryParts: string[] = [];
	if (opts.type === 'query' && opts.methodOverride !== 'POST') {
		const input = getInput({ runtime: opts.runtime, input: opts.input });
		if (input !== undefined) {
			queryParts.push(`input=${encodeURIComponent(JSON.stringify(input))}`);
		}
	}
	if (queryParts.length) {
		url += `?${queryParts.join('&')}`;
	}
	return url;
}

function getBody(opts: {
	type: ProcedureType;
	input?: unknown;
	runtime: TRPCClientRuntime;
	methodOverride?: 'POST';
}) {
	if (opts.type === 'query' && opts.methodOverride !== 'POST') {
		return undefined;
	}
	const input = getInput({ runtime: opts.runtime, input: opts.input });
	return input !== undefined ? JSON.stringify(input) : undefined;
}

async function angularHttpRequester(opts: {
	httpClient: HttpClient;
	url: string;
	type: ProcedureType;
	path: string;
	input?: unknown;
	signal?: AbortSignal;
	headers: HTTPHeaders;
	runtime: TRPCClientRuntime;
	methodOverride?: 'POST';
}): Promise<HTTPResult> {
	throwIfAborted(opts.signal);

	// Keep parity with tRPC httpLink error semantics by returning HTTPResult for HTTP errors.
	if (opts.type === 'subscription') {
		throw new Error('Subscriptions are unsupported by `angularHttpLink` - use wsLink');
	}

	const method = opts.methodOverride ?? METHOD[opts.type];
	const urlWithParams = getUrl({
		url: opts.url,
		path: opts.path,
		type: opts.type,
		input: opts.input,
		runtime: opts.runtime,
		methodOverride: opts.methodOverride,
	});

	let angularHeaders = new AngularHttpHeaders();
	for (const [key, value] of Object.entries(opts.headers)) {
		if (value === undefined) {
			continue;
		}
		if (Array.isArray(value)) {
			angularHeaders = angularHeaders.set(key, value.join(', '));
		} else {
			angularHeaders = angularHeaders.set(key, value);
		}
	}
	if (method === 'POST') {
		angularHeaders = angularHeaders.set('Content-Type', 'application/json');
	}

	const requestOptions = {
		headers: angularHeaders,
		observe: 'response' as const,
		responseType: 'json' as const,
	};

	const body = getBody({
		type: opts.type,
		input: opts.input,
		runtime: opts.runtime,
		methodOverride: opts.methodOverride,
	});
	const request$ =
		method === 'GET' ? opts.httpClient.get(urlWithParams, requestOptions) : opts.httpClient.post(urlWithParams, body, requestOptions);

	return new Promise((resolve, reject) => {
		let aborted = false;
		let onAbort: (() => void) | undefined;
		const subscription = request$.subscribe({
			next: (response) => {
				if (aborted) {
					return;
				}
				onAbort && opts.signal?.removeEventListener('abort', onAbort);
				const meta = {
					response: {
						status: response.status,
						statusText: response.statusText,
						headers: response.headers,
						url: response.url ?? undefined,
						json: async () => response.body,
						text: async () => JSON.stringify(response.body),
					},
					responseJSON: response.body,
				};
				resolve({
					json: response.body as TRPCResponse,
					meta,
				});
			},
			error: (error: unknown) => {
				if (aborted) {
					return;
				}
				onAbort && opts.signal?.removeEventListener('abort', onAbort);

				if (error instanceof HttpErrorResponse) {
					const meta = {
						response: {
							status: error.status,
							statusText: error.statusText || 'Unknown Error',
							headers: error.headers,
							url: error.url ?? undefined,
							json: async () => error.error,
							text: async () => JSON.stringify(error.error),
						},
						responseJSON: error.error,
					};

					const responseBody =
						error.error ??
						({
							error: {
								message: error.message || 'HTTP Error',
								code: TRPC_ERROR_CODES_BY_KEY.INTERNAL_SERVER_ERROR,
								data: {
									code: 'INTERNAL_SERVER_ERROR',
									httpStatus: error.status || 500,
								},
							},
						} as TRPCResponse);

					resolve({
						json: responseBody as TRPCResponse,
						meta,
					});
					return;
				}
				reject(error);
			},
		});

		if (opts.signal) {
			onAbort = () => {
				aborted = true;
				subscription.unsubscribe();
				try {
					throwIfAborted(opts.signal);
				} catch (cause) {
					reject(cause);
				}
			};

			if (opts.signal.aborted) {
				onAbort();
				return;
			}

			opts.signal.addEventListener('abort', onAbort);
		}
	});
}

export function angularHttpLink<TRouter extends AnyRouter = AnyRouter>(
	opts: AngularHttpLinkOptions,
): TRPCLink<TRouter> {
	const url = resolveBaseUrl(opts.url);

	return (runtime) =>
		({ op }) =>
			observable((observer) => {
				const { path, input, type } = op;
				Promise.resolve(
					typeof opts.headers === 'function' ? opts.headers({ op }) : opts.headers ?? {},
				)
					.then((headers) =>
						angularHttpRequester({
							httpClient: opts.httpClient,
							url,
							type,
							path,
							input,
							runtime,
							headers,
							methodOverride: opts.methodOverride,
							signal: (op as { signal?: AbortSignal }).signal,
						}),
					)
					.then((res) => {
						const transformed = transformResult(res.json, runtime);

						if (!transformed.ok) {
							observer.error(
								TRPCClientError.from(transformed.error, {
									meta: res.meta,
								}),
							);
							return;
						}

						observer.next({
							context: res.meta,
							result: transformed.result,
						});
						observer.complete();
					})
					.catch((cause) => {
						observer.error(TRPCClientError.from(cause, { meta: undefined }));
					});

				return () => {
					// Cleanup is handled via AbortSignal/unsubscribe in the requester.
				};
			});
}
