import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-radio-indicator',
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<div class="group-data-[checked=true]:bg-primary size-2 rounded-full bg-transparent"></div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmRadioIndicator {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'relative flex items-center justify-center border-input text-primary group-has-[:focus-visible]:border-ring group-has-[:focus-visible]:ring-ring/50 dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none group-has-[:focus-visible]:ring-[3px] group-data=[disabled=true]:cursor-not-allowed group-data=[disabled=true]:opacity-50',
			this.userClass(),
		),
	);
}
