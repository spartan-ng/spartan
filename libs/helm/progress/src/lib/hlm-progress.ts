import { computed, Directive, input } from '@angular/core';
import { BrnProgress } from '@spartan-ng/brain/progress';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'hlm-progress,[hlmProgress]',
	hostDirectives: [{ directive: BrnProgress, inputs: ['value', 'max', 'getValueLabel'] }],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmProgress {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('bg-primary/20 relative inline-flex h-2 w-full overflow-hidden rounded-full', this.userClass()),
	);
}
