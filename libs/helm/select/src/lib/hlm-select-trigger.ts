import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { BrnSelectTrigger } from '@spartan-ng/brain/select';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'button[hlm-select-trigger],button[hlmSelectTrigger]',
	exportAs: 'hlmSelectTrigger',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{ directive: BrnSelectTrigger, inputs: ['id: buttonId', 'forceInvalid', 'aria-invalid'] },
		{ directive: BrnFieldControlDescribedBy, inputs: ['aria-describedby'] },
	],
	host: {
		'data-slot': 'select-trigger',
		'[attr.data-size]': 'size()',
	},
	template: `
		<ng-content />
		@if (!hideIcon()) {
			<ng-icon name="lucideChevronDown" class="spartan-select-trigger-icon ms-auto" />
		}
	`,
})
export class HlmSelectTrigger {
	public readonly size = input<'default' | 'sm'>('default');

	public readonly hideIcon = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	constructor() {
		classes(
			() =>
				'spartan-select-trigger flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
		);
	}
}
