import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { BrnSelectTrigger } from '@spartan-ng/brain/select';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-select-trigger',
	imports: [NgIcon, BrnSelectTrigger, BrnFieldControlDescribedBy],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button
			brnSelectTrigger
			brnFieldControlDescribedBy
			[forceInvalid]="forceInvalid()"
			[id]="buttonId()"
			[class]="_computedClass()"
			[attr.data-size]="size()"
			data-slot="select-trigger"
		>
			<ng-content />
			<ng-icon name="lucideChevronDown" class="spartan-select-trigger-icon ms-auto" />
		</button>
	`,
})
export class HlmSelectTrigger {
	private static _id = 0;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'spartan-select-trigger flex w-fit justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
			this.userClass(),
		),
	);

	public readonly buttonId = input<string>(`hlm-select-trigger-${HlmSelectTrigger._id++}`);

	public readonly size = input<'default' | 'sm'>('default');

	/** Whether to force the trigger into an invalid state. */
	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
}
