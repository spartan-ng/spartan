import { computed, Directive } from '@angular/core';
import { HlmInput, inputVariants } from '@spartan-ng/helm/input';
import { hlm } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'input[hlmSidebarInput]',
	host: {
		'data-slot': 'sidebar-input',
		'data-sidebar': 'input',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarInput extends HlmInput {
	protected override readonly _computedClass = computed(() =>
		hlm(
			inputVariants({ error: this._state().error }),
			'bg-background focus-visible:ring-sidebar-ring h-8 w-full shadow-none focus-visible:ring-2',
			this.userClass(),
		),
	);
}
