import { type NumberInput, coerceNumberProperty } from '@angular/cdk/coercion';
import { type AfterViewInit, Directive, ElementRef, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
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
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[style.padding-bottom]': '_computedPaddingBottom()',
	},
})
export class HlmAspectRatioDirective implements AfterViewInit {
	private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

	public readonly ratio = input(1, {
		alias: 'hlmAspectRatio',
		transform: (value: NumberInput) => {
			const coerced = coerceNumberProperty(parseDividedString(value));
			return coerced <= 0 ? 1 : coerced;
		},
	});
	protected readonly _computedPaddingBottom = computed(() => `${100 / this.ratio()}%`);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('relative w-full', this.userClass()));

	ngAfterViewInit() {
		// support delayed addition of image to dom
		const child = this._el.firstElementChild;
		if (child) {
			child.classList.add('absolute', 'w-full', 'h-full', 'object-cover');
		}
	}
}
