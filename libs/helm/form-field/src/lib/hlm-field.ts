import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

// TODO test data-slot selectors in angular nested components
export const fieldVariants = cva('group/field data-[invalid=true]:text-destructive flex w-full gap-3', {
	variants: {
		orientation: {
			vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
			horizontal: [
				'flex-row items-center',
				'[&>[data-slot=field-label]]:flex-auto',
				'has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px has-[>[data-slot=field-content]]:items-start',
			],
			responsive: [
				'@md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto flex-col [&>*]:w-full [&>.sr-only]:w-auto',
				'@md/field-group:[&>[data-slot=field-label]]:flex-auto',
				'@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
			],
		},
	},
	defaultVariants: {
		orientation: 'vertical',
	},
});

@Directive({
	selector: '[hlmField],hlm-field',
	host: {
		role: 'group',
		'data-slot': 'field',
		'[attr.data-orientation]': 'orientation()',
		'[class]': '_computedClass()',
	},
})
export class HlmField {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	public readonly orientation = input<'vertical' | 'horizontal'>('vertical');

	protected readonly _computedClass = computed(() =>
		hlm(fieldVariants({ orientation: this.orientation() }), this.userClass()),
	);
}
