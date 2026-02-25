import type { BooleanInput } from '@angular/cdk/coercion';
import {
	ChangeDetectionStrategy,
	Component,
	booleanAttribute,
	input,
	computed,
	inject,
} from '@angular/core';
import { BrnComboboxContent, BrnComboboxList } from '@spartan-ng/brain/combobox';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import {
	injectExposedSideProvider,
	injectExposesStateProvider,
} from '@spartan-ng/brain/core';
import { hlm } from '@spartan-ng/helm/utils';
import { HlmSelectScrollUp } from './hlm-select-scroll-up';
import { HlmSelectScrollDown } from './hlm-select-scroll-down';

@Component({
	selector: 'hlm-select-content',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [BrnPopoverContent, BrnComboboxContent, BrnComboboxList, HlmSelectScrollUp, HlmSelectScrollDown],
	host: {
		style: 'display: none',
	},
	template: `
		<ng-template brnPopoverContent>
			<div
				brnComboboxContent
				brnComboboxList
				[class]="_computedClass()"
				[attr.data-state]="_state()"
				[attr.data-side]="_side()"
				[attr.data-sticky]="_stickyLabels()"
			>
				<hlm-select-scroll-up />
				<div class="p-1">
					<ng-content />
				</div>
				<hlm-select-scroll-down />
			</div>
		</ng-template>
	`,
})
export class HlmSelectContent {
	private readonly _stateProvider = injectExposesStateProvider({ optional: true });
	private readonly _sideProvider = injectExposedSideProvider({ optional: true });

	protected readonly _state = computed(() => this._stateProvider?.state() ?? 'open');
	protected readonly _side = computed(() => this._sideProvider?.side() ?? 'bottom');

	public readonly stickyLabels = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	protected readonly _stickyLabels = computed(() => (this.stickyLabels() ? '' : null));

	protected readonly _computedClass = computed(() =>
		hlm(
			'border-border bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 flex max-h-[calc(100vh-3rem)] w-full min-w-[8rem] flex-col overflow-y-auto rounded-md border shadow-md data-[side=bottom]:top-[4px] data-[side=top]:bottom-[4px] scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
		),
	);
}
