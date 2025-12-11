import { computed, Directive, input } from '@angular/core';
import { BrnTabsTrigger } from '@spartan-ng/brain/tabs';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmTabsTrigger]',
	hostDirectives: [{ directive: BrnTabsTrigger, inputs: ['brnTabsTrigger: hlmTabsTrigger', 'disabled'] }],
	host: {
		'data-slot': 'tabs-trigger',
		'[class]': '_computedClass()',
	},
})
export class HlmTabsTrigger {
	public readonly triggerFor = input.required<string>({ alias: 'hlmTabsTrigger' });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			`data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0 [&_ng-icon:not([class*='text-'])]:text-base`,
			this.userClass(),
		),
	);
}
