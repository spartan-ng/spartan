import { computed, Directive, effect, inject, input } from '@angular/core';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';
import { hlm } from '@spartan-ng/helm/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const inputGroupAddonVariants = cva('flex items-center gap-2 text-sm shadow-none', {
	variants: {
		size: {
			xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>ng-icon]:px-2 [&>ng-icon:not([class*='text-'])]:text-sm",
			sm: 'h-8 gap-1.5 rounded-md px-2.5 has-[>ng-icon]:px-2.5',
			'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>ng-icon]:p-0',
			'icon-sm': 'size-8 p-0 has-[>ng-icon]:p-0',
		},
	},
	defaultVariants: {
		size: 'xs',
	},
});

type InputGroupAddonVariants = VariantProps<typeof inputGroupAddonVariants>;

@Directive({
	selector: 'button[hlmInputGroupButton]',
	providers: [
		provideBrnButtonConfig({
			variant: 'ghost',
		}),
	],
	hostDirectives: [
		{
			directive: HlmButton,
			inputs: ['variant'],
		},
	],
	host: {
		'[attr.data-size]': 'size()',
		'[type]': 'type()',
	},
})
export class HlmInputGroupButton {
	private readonly _hlmButton = inject(HlmButton);
	public readonly size = input<InputGroupAddonVariants['size']>('xs');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly type = input<'button' | 'submit' | 'reset'>('button');

	protected readonly _computedClass = computed(() =>
		hlm(inputGroupAddonVariants({ size: this.size() }), this.userClass()),
	);

	constructor() {
		effect(() => {
			this._hlmButton.setClass(this._computedClass());
		});
	}
}
