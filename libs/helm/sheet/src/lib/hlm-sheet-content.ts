import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';
import { HlmSheetClose } from './hlm-sheet-close';

// Full, non-interpolated class strings per side. Tailwind's scanner only sees
// classes that appear literally in source, so a dynamic `slide-*-${side}` would
// be purged and the sheet would fade in place instead of sliding. Listing every
// side keeps all four `slide-in-from-*`/`slide-out-to-*` utilities in the build.
const SHEET_ENTER_CLASSES: Record<string, string> = {
	top: 'animate-in duration-500 ease-in-out slide-in-from-top',
	bottom: 'animate-in duration-500 ease-in-out slide-in-from-bottom',
	left: 'animate-in duration-500 ease-in-out slide-in-from-left',
	right: 'animate-in duration-500 ease-in-out slide-in-from-right',
};

const SHEET_LEAVE_CLASSES: Record<string, string> = {
	top: 'animate-out duration-300 ease-in-out slide-out-to-top',
	bottom: 'animate-out duration-300 ease-in-out slide-out-to-bottom',
	left: 'animate-out duration-300 ease-in-out slide-out-to-left',
	right: 'animate-out duration-300 ease-in-out slide-out-to-right',
};

@Component({
	selector: 'hlm-sheet-content',
	imports: [HlmIconImports, HlmButton, HlmSheetClose],
	providers: [provideIcons({ lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'sheet-content',
		'[attr.data-side]': '_sideProvider.side()',
		'[attr.data-state]': 'state()',
		// Side-aware enter/exit animations, coordinated natively by Angular
		// (animate.enter on attach, animate.leave on close/detach), replacing the
		// data-[side=*] slide utilities which conflict with animate.leave on exit.
		'[animate.enter]': '_enterClasses()',
		'[animate.leave]': '_leaveClasses()',
	},
	template: `
		<ng-content />

		@if (showCloseButton()) {
			<button hlmBtn variant="ghost" size="icon-sm" class="spartan-sheet-close" hlmSheetClose>
				<span class="sr-only">Close</span>
				<ng-icon hlm size="sm" name="lucideX" />
			</button>
		}
	`,
})
export class HlmSheetContent {
	private readonly _stateProvider = injectExposesStateProvider({ host: true });
	protected readonly _sideProvider = injectExposedSideProvider({ host: true });
	public readonly state = this._stateProvider.state ?? signal('closed');
	protected readonly _enterClasses = computed(
		() => SHEET_ENTER_CLASSES[this._sideProvider.side()] ?? SHEET_ENTER_CLASSES['right'],
	);
	protected readonly _leaveClasses = computed(
		() => SHEET_LEAVE_CLASSES[this._sideProvider.side()] ?? SHEET_LEAVE_CLASSES['right'],
	);

	public readonly showCloseButton = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	constructor() {
		classes(() => 'spartan-sheet-content');
	}
}
