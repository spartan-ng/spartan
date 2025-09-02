import { type NumberInput, coerceNumberProperty } from '@angular/cdk/coercion';
import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

const parseDividedString = (value: NumberInput): NumberInput => {
	if (typeof value !== 'string' || !value.includes('/')) return value;
	return value
		.split('/')
		.map((v) => Number.parseInt(v, 10))
		.reduce((a, b) => a / b);
};

@Directive({
	selector: '[hlmAspectRatio]',
	host: {
		'[class]': '_computedClass()',
		'[style.padding-bottom.%]': '100 / ratio()',
	},
})
export class HlmAspectRatio {
	/**
	 * Aspect ratio of the element, defined as width / height.
	 */
	public readonly ratio = input<number, NumberInput>(1, {
		alias: 'hlmAspectRatio',
		transform: (value: NumberInput) => {
			const coerced = coerceNumberProperty(parseDividedString(value));
			return coerced <= 0 ? 1 : coerced;
		},
	});

	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'relative w-full [&>*:first-child]:absolute [&>*:first-child]:h-full [&>*:first-child]:w-full [&>*:first-child]:object-cover',
			this.userClass(),
		),
	);
}
