import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnAffixes } from '@spartan-ng/brain/input-group';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-prefix-addon,[hlmPrefixAddon]',
	hostDirectives: [
		{
			directive: BrnAffixes,
			inputs: ['tabindex'],
		},
	],
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmPrefixAddon {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-muted border-input focus-visible:border-ring focus-visible:ring-ring/50 block' +
				' text-muted-foreground inline-flex h-auto min-h-9' +
				' items-center justify-center border whitespace-nowrap' +
				' px-3 text-sm font-medium transition-colors' +
				' focus-visible:ring-[3px] focus-visible:outline-none' +
				' disabled:pointer-events-none disabled:opacity-50' +
				' rounded-l-md border-r-0',
			this.userClass(),
		),
	);
}
