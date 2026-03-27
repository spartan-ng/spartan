import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { BrnSelectTrigger, BrnSelectTriggerWrapper } from '@spartan-ng/brain/select';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-select-trigger',
	imports: [NgIcon, BrnSelectTrigger, BrnFieldControlDescribedBy],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnSelectTriggerWrapper],
	template: `
		<button
			brnSelectTrigger
			brnFieldControlDescribedBy
			[id]="buttonId()"
			[class]="_computedClass()"
			[attr.data-size]="size()"
			data-slot="select-trigger"
		>
			<ng-content />
			<ng-icon name="lucideChevronDown" class="text-muted-foreground pointer-events-none text-base" />
		</button>
	`,
})
export class HlmSelectTrigger {
	private static _id = 0;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			"border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-1.5 rounded-md border bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0 [&_ng-icon:not([class*='text-'])]:text-base",
			'data-[matches-spartan-invalid=true]:ring-destructive/20 dark:data-[matches-spartan-invalid=true]:ring-destructive/40 data-[matches-spartan-invalid=true]:border-destructive dark:data-[matches-spartan-invalid=true]:border-destructive/50 data-[matches-spartan-invalid=true]:ring-3',
			this.userClass(),
		),
	);

	public readonly buttonId = input<string>(`hlm-select-trigger-${HlmSelectTrigger._id++}`);

	public readonly size = input<'default' | 'sm'>('default');
}
