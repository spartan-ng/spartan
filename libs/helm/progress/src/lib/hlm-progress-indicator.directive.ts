import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { injectBrnProgress } from '@spartan-ng/brain/progress';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmProgressIndicator],brn-progress-indicator[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[class.animate-indeterminate]': 'indeterminate()',
		'[style.transform]': 'transform()',
	},
})
export class HlmProgressIndicatorDirective {
	private readonly _progress = injectBrnProgress();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('inline-flex transform-gpu h-full w-full flex-1 bg-primary transition-all', this.userClass()),
	);

	protected readonly transform = computed(() => `translateX(-${100 - (this._progress.value() ?? 100)}%)`);

	protected readonly indeterminate = computed(
		() => this._progress.value() === null || this._progress.value() === undefined,
	);
}
