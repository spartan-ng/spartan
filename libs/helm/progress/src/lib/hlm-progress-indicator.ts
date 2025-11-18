import { computed, Directive, input } from '@angular/core';
import { BrnProgressIndicator, injectBrnProgress } from '@spartan-ng/brain/progress';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmProgressIndicator],hlm-progress-indicator',
	hostDirectives: [BrnProgressIndicator],
	host: {
		'[class]': '_computedClass()',
		'[class.animate-indeterminate]': '_indeterminate()',
		'[style.transform]': '_transform()',
	},
})
export class HlmProgressIndicator {
	private readonly _progress = injectBrnProgress();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm('bg-primary h-full w-full flex-1 transition-all', this.userClass()),
	);

	protected readonly _transform = computed(() => `translateX(-${100 - (this._progress.value() ?? 100)}%)`);

	protected readonly _indeterminate = computed(
		() => this._progress.value() === null || this._progress.value() === undefined,
	);
}
