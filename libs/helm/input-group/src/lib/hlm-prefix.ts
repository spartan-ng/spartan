import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnAffixes } from '@spartan-ng/brain/input-group';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-prefix,[hlmPrefix]',
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
export class HlmPrefix {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('text-muted-foreground inset-y-0 z-10 flex items-center ' + this.userClass()),
	);
}
