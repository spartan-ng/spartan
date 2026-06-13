import { computed, Directive, signal } from '@angular/core';
import { BrnAutocompleteContent } from '@spartan-ng/brain/autocomplete';
import { injectExposedSideProvider } from '@spartan-ng/brain/core';
import { classes } from '@spartan-ng/helm/utils';

// Directional enter slide keyed by the resolved side (static literals so Tailwind
// keeps every `slide-in-from-*-2` utility).
const AUTOCOMPLETE_ENTER_SLIDE: Record<'top' | 'bottom' | 'left' | 'right', string> = {
	top: 'slide-in-from-bottom-2',
	bottom: 'slide-in-from-top-2',
	left: 'slide-in-from-right-2',
	right: 'slide-in-from-left-2',
};

@Directive({
	selector: '[hlmAutocompleteContent],hlm-autocomplete-content',
	hostDirectives: [BrnAutocompleteContent],
	host: {
		'[attr.data-side]': '_side()',
		// Enter/exit animations coordinated natively by Angular. The enter slides in
		// from the resolved side; the exit fades + zooms out.
		'[animate.enter]': '_enterClasses()',
		'animate.leave': 'animate-out fade-out-0 zoom-out-95 duration-150',
	},
})
export class HlmAutocompleteContent {
	private readonly _sideProvider = injectExposedSideProvider({ host: true, optional: true });
	protected readonly _side = this._sideProvider?.side ?? signal<'top' | 'bottom' | 'left' | 'right'>('bottom');
	protected readonly _enterClasses = computed(
		() => `animate-in fade-in-0 zoom-in-95 duration-150 ${AUTOCOMPLETE_ENTER_SLIDE[this._side()]}`,
	);

	constructor() {
		classes(
			() => 'group/autocomplete-content spartan-autocomplete-content flex w-(--brn-autocomplete-width) flex-col p-0',
		);
	}
}
