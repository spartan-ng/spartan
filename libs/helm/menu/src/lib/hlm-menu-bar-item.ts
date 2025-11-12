import { type BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, computed, input } from '@angular/core';
import { BrnMenuItem } from '@spartan-ng/brain/menu';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmMenuBarItem]',
	hostDirectives: [BrnMenuItem],
	host: {
		'data-slot': 'menubar-item',
		'[attr.data-variant]': 'variant()',
		'[attr.data-inset]': 'inset() ? "" : null',
		'[class]': '_computedClass()',
	},
})
export class HlmMenuBarItem {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	public readonly inset = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	public readonly variant = input<'default' | 'destructive'>('default');

	protected readonly _computedClass = computed(() =>
		hlm(
			"focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[ng-icon]:!text-destructive [&_ng-icon:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0 [&_ng-icon:not([class*='text-'])]:text-base",
			this.userClass(),
		),
	);
}
