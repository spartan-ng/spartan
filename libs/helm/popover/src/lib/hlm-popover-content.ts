import { computed, Directive, signal } from '@angular/core';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { classes } from '@spartan-ng/helm/utils';

// Directional enter slide: the content slides in from the trigger's edge, keyed by
// the resolved side. Static (non-interpolated) strings so Tailwind keeps every
// `slide-in-from-*-2` utility in the build.
const POPOVER_ENTER_SLIDE: Record<'top' | 'bottom' | 'left' | 'right', string> = {
	top: 'slide-in-from-bottom-2',
	bottom: 'slide-in-from-top-2',
	left: 'slide-in-from-right-2',
	right: 'slide-in-from-left-2',
};

@Directive({
	selector: '[hlmPopoverContent],hlm-popover-content',
	host: {
		'[attr.data-state]': 'state()',
		'[attr.data-side]': '_side()',
		// Enter/exit animations coordinated natively by Angular (animate.enter on
		// attach, animate.leave on close/detach). The enter slides in from the resolved
		// side; the exit fades + zooms out. Replaces the data-state animation utilities.
		'[animate.enter]': '_enterClasses()',
		'animate.leave': 'animate-out fade-out-0 zoom-out-95 duration-150',
	},
})
export class HlmPopoverContent {
	private readonly _stateProvider = injectExposesStateProvider({ host: true });
	private readonly _sideProvider = injectExposedSideProvider({ host: true, optional: true });
	public state = this._stateProvider.state ?? signal('closed');
	protected readonly _side = this._sideProvider?.side ?? signal<'top' | 'bottom' | 'left' | 'right'>('bottom');
	protected readonly _enterClasses = computed(
		() => `animate-in fade-in-0 zoom-in-95 duration-150 ${POPOVER_ENTER_SLIDE[this._side()]}`,
	);

	constructor() {
		classes(() => 'spartan-popover-content relative flex w-72 flex-col outline-none');
	}
}
