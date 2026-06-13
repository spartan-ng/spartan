import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { injectExposedSideProvider } from '@spartan-ng/brain/core';
import { BrnSelectContent } from '@spartan-ng/brain/select';
import { classes, hlm } from '@spartan-ng/helm/utils';
import { HlmSelectScrollDown } from './hlm-select-scroll-down';
import { HlmSelectScrollUp } from './hlm-select-scroll-up';

// Directional enter slide keyed by the resolved side (static literals so Tailwind
// keeps every `slide-in-from-*-2` utility).
const SELECT_ENTER_SLIDE: Record<'top' | 'bottom' | 'left' | 'right', string> = {
	top: 'slide-in-from-bottom-2',
	bottom: 'slide-in-from-top-2',
	left: 'slide-in-from-right-2',
	right: 'slide-in-from-left-2',
};

@Component({
	selector: 'hlm-select-content',
	imports: [HlmSelectScrollUp, HlmSelectScrollDown],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnSelectContent],
	host: {
		'[attr.data-side]': '_side()',
		// Enter/exit animations coordinated natively by Angular. The enter slides in
		// from the resolved side; the exit fades + zooms out.
		'[animate.enter]': '_enterClasses()',
		'animate.leave': 'animate-out fade-out-0 zoom-out-95 duration-150',
	},
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
	private readonly _sideProvider = injectExposedSideProvider({ host: true, optional: true });
	protected readonly _side = this._sideProvider?.side ?? signal<'top' | 'bottom' | 'left' | 'right'>('bottom');
	protected readonly _enterClasses = computed(
		() => `animate-in fade-in-0 zoom-in-95 duration-150 ${SELECT_ENTER_SLIDE[this._side()]}`,
	);

	protected readonly _computedListboxClasses = computed(() => hlm('flex flex-col'));

	public readonly showScroll = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	constructor() {
		classes(() => 'spartan-select-content relative flex w-(--brn-select-width) overflow-x-hidden overflow-y-auto');
	}
}
