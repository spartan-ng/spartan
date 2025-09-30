import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-dialog-footer',
	template: `
		<ng-content />
	`,
	host: {
		'[class]': '_computedClass()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmDialogFooter {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', this.userClass()),
	);
}
