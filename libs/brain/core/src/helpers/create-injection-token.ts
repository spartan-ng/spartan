import { type InjectOptions, InjectionToken, type Provider, type Type, forwardRef, inject } from '@angular/core';

type InjectFn<TTokenValue> = {
	(): TTokenValue;
	(injectOptions: InjectOptions & { optional?: false }): TTokenValue;
	(injectOptions: InjectOptions & { optional: true }): TTokenValue | null;
};

type ProvideFn<TTokenValue> = (value: TTokenValue) => Provider;

type ProvideExistingFn<TTokenValue> = (valueFactory: () => Type<TTokenValue>) => Provider;

export type CreateInjectionTokenReturn<TTokenValue> = [
	InjectFn<TTokenValue>,
	ProvideFn<TTokenValue>,
	ProvideExistingFn<TTokenValue>,
	InjectionToken<TTokenValue>,
];

export function createInjectionToken<TTokenValue>(description: string): CreateInjectionTokenReturn<TTokenValue> {
	const token = new InjectionToken<TTokenValue>(description);

	const provideFn = (value: TTokenValue) => {
		return { provide: token, useValue: value };
	};

	const provideExistingFn = (value: () => TTokenValue) => {
		return { provide: token, useExisting: forwardRef(value) };
	};

	const injectFn = (options: InjectOptions = {}) => {
		return inject(token, options);
	};

	return [injectFn, provideFn, provideExistingFn, token] as CreateInjectionTokenReturn<TTokenValue>;
}
