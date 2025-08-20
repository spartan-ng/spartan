import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnProgress } from '@spartan-ng/brain/progress';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'hlm-progress,[hlmProgress]',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [{ directive: BrnProgress, inputs: ['value', 'max', 'getValueLabel'] }],
})
export class HlmProgress {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('inline-flex bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', this.userClass()),
	);
}
