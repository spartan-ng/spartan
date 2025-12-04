import { computed, Directive, input, signal } from '@angular/core';
import { injectExposesStateProvider } from '@spartan-ng/brain/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAlertDialogContent],hlm-alert-dialog-content',
	host: {
		'data-slot': 'alert-dialog-content',
		'[class]': '_computedClass()',
		'[attr.data-state]': 'state()',
	},
})
export class HlmAlertDialogContent {
	private readonly _stateProvider = injectExposesStateProvider({ optional: true, host: true });
	public readonly state = this._stateProvider?.state ?? signal('closed');

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative z-50 mx-auto grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg data-[state=closed]:duration-200 data-[state=open]:duration-200 sm:mx-0 sm:max-w-lg',
			this.userClass(),
		),
	);
}
