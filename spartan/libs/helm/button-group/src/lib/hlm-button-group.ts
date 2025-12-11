import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export const buttonGroupVariants = cva(
	"flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
	{
		variants: {
			orientation: {
				horizontal:
					'[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
				vertical:
					'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
			},
		},
		defaultVariants: {
			orientation: 'horizontal',
		},
	},
);

@Directive({
	selector: '[hlmButtonGroup],hlm-button-group',
	host: {
		'data-slot': 'button-group',
		role: 'group',
		'[class]': '_computedClass()',
		'[attr.data-orientation]': 'orientation()',
	},
})
export class HlmButtonGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

	protected readonly _computedClass = computed(() =>
		hlm(buttonGroupVariants({ orientation: this.orientation() }), this.userClass()),
	);
}
