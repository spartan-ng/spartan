import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { BrnMenuItem } from '@spartan-ng/brain/menu';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenuItem]',
	hostDirectives: [
		{
			directive: BrnMenuItem,
			inputs: ['disabled: disabled'],
			outputs: ['triggered: triggered'],
		},
	],
	host: {
		'[class]': '_computedClass()',
		'[attr.data-variant]': 'variant()',
		'[attr.data-inset]': 'inset() ? "" : null',
	},
})
export class HlmMenuItem {
	public readonly variant = input<'default' | 'destructive'>('default');

	public readonly inset = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			`hover:bg-accent focus-visible:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[ng-icon]:!text-destructive [&_ng-icon:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0`,
			this.userClass(),
		),
	);
}
