import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const fieldVariants = cva('group/field data-[invalid=true]:text-destructive flex w-full gap-3', {
	variants: {
		orientation: {
			vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
			horizontal: [
				'flex-row items-center',
				'[&>[data-slot=field-label]]:flex-auto',
				'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
			],
			responsive: [
				'flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto',
				'@md/field-group:[&>[data-slot=field-label]]:flex-auto',
				'@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
			],
		},
	},
	defaultVariants: {
		orientation: 'vertical',
	},
});

export type FieldVariants = VariantProps<typeof fieldVariants>;

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
	public readonly orientation = input<FieldVariants['orientation']>('vertical');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(fieldVariants({ orientation: this.orientation() }), this.userClass()),
	);
}
