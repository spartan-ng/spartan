import { Directive, computed } from '@angular/core';
import { BrnProgressIndicator, injectBrnProgress } from '@spartan-ng/brain/progress';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmProgressIndicator],hlm-progress-indicator',
	hostDirectives: [BrnProgressIndicator],
	host: { '[class.animate-indeterminate]': '_indeterminate()', '[style.transform]': '_transform()' },
})
export class HlmProgressIndicator {
	private readonly _progress = injectBrnProgress();
	protected readonly _transform = computed(() => `translateX(-${100 - (this._progress.value() ?? 100)}%)`);
	protected readonly _indeterminate = computed(
		() => this._progress.value() === null || this._progress.value() === undefined,
	);

	constructor() {
		classes(() => 'bg-primary h-full w-full flex-1 transition-all');
	}
}
