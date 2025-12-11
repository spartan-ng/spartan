import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, computed, input } from '@angular/core';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSelectContent], hlm-select-content',
	host: {
		'[class]': '_computedClass()',
		'[attr.data-state]': '_stateProvider?.state() ?? "open"',
		'[attr.data-side]': '_sideProvider?.side() ?? "bottom"',
	},
})
export class HlmSelectContent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly stickyLabels = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});
	protected readonly _stateProvider = injectExposesStateProvider({ optional: true });
	protected readonly _sideProvider = injectExposedSideProvider({ optional: true });

	protected readonly _computedClass = computed(() =>
		hlm(
			'border-border bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 w-full min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md data-[side=bottom]:top-[2px] data-[side=top]:bottom-[2px]',
			this.userClass(),
		),
	);
}
