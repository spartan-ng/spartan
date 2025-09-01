import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, signal } from '@angular/core';
import { injectExposesStateProvider } from '@spartan-ng/brain/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-alert-dialog-content',
	host: {
		'[class]': '_computedClass()',
		'[attr.data-state]': 'state()',
	},
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmAlertDialogContent {
	private readonly _stateProvider = injectExposesStateProvider({ optional: true, host: true });
	public readonly state = this._stateProvider?.state ?? signal('closed');

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 justify-self-center rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
			this.userClass(),
		),
	);
}
