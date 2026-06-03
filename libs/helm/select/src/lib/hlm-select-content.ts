import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnSelectContent } from '@spartan-ng/brain/select';
import { classes, hlm } from '@spartan-ng/helm/utils';
import { HlmSelectScrollDown } from './hlm-select-scroll-down';
import { HlmSelectScrollUp } from './hlm-select-scroll-up';

@Component({
	selector: 'hlm-select-content',
	imports: [HlmSelectScrollUp, HlmSelectScrollDown],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnSelectContent],
	template: `
		@if (showScroll()) {
			<hlm-select-scroll-up />
		}

		<div role="listbox" [class]="_computedListboxClasses()">
			<ng-content />
		</div>

		@if (showScroll()) {
			<hlm-select-scroll-down />
		}
	`,
})
export class HlmSelectContent {
	protected readonly _computedListboxClasses = computed(() => hlm('flex flex-col'));

	public readonly showScroll = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	constructor() {
		classes(() => 'spartan-select-content relative flex w-(--brn-select-width) overflow-x-hidden overflow-y-auto');
	}
}
