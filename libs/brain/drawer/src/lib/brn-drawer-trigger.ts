import { Directive, computed, effect, inject, input } from '@angular/core';
import { BrnDrawer } from './brn-drawer';

let idSequence = 0;

/**
 * Headless trigger for `BrnDrawer`. Mirrors the Vaul / shadcn `Drawer.Trigger`
 * API and the existing spartan `BrnDialogTrigger` shape.
 *
 * Resolves the target drawer in two ways (mutually exclusive):
 *
 * 1. **Explicit reference** via `[brnDrawerTriggerFor]="drawer"`. Use when the
 *    button sits outside the drawer's DOM tree (the typical case — the trigger
 *    is in page content, the drawer is a sibling overlay).
 * 2. **Ancestor injection** via `inject(BrnDrawer, { optional: true })`. Use
 *    when the button is rendered inside the drawer (e.g. a footer button that
 *    re-opens after partial drag).
 *
 * Beyond opening on click, the directive maintains the WAI-ARIA wiring expected
 * of a modal trigger:
 *
 * - `aria-haspopup="dialog"` so screen readers announce the button's role
 * - `aria-expanded` reflects the drawer's open state
 * - `aria-controls` ties the button to the drawer's id
 * - `data-state` mirrors the state machine for CSS theming
 * - `type` defaults to `button` so a trigger inside a `<form>` does not submit
 *
 * `isOpen` (the input on `BrnDrawer`) is left untouched — the trigger drives
 * the internal state machine via `BrnDrawer.open()`. Consumers that bind
 * `[isOpen]` for one-way control keep ownership of their signal; the trigger
 * is an additive entry point, not a replacement for declarative control.
 */
@Directive({
	selector: 'button[brnDrawerTrigger],button[brnDrawerTriggerFor]',
	exportAs: 'brnDrawerTrigger',
	host: {
		'[id]': 'id()',
		'(click)': 'open()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true' : 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'drawerId()',
		'[type]': 'type()',
	},
})
export class BrnDrawerTrigger {
	private _injectedDrawer = inject(BrnDrawer, { optional: true, skipSelf: true });

	public readonly id = input<string>(`brn-drawer-trigger-${++idSequence}`);
	public readonly type = input<'button' | 'submit' | 'reset'>('button');

	/**
	 * Explicit reference to the target drawer. Takes precedence over the
	 * ancestor-injected drawer (if any).
	 */
	public readonly brnDrawerTriggerFor = input<BrnDrawer | undefined>(undefined, {
		alias: 'brnDrawerTriggerFor',
	});

	private readonly _drawer = computed(() => this.brnDrawerTriggerFor() ?? this._injectedDrawer);

	/** State of the resolved drawer; `'closed'` when no drawer is reachable. */
	public readonly state = computed(() => this._drawer()?.state() ?? 'closed');

	/** Stable id of the resolved drawer for `aria-controls`. */
	public readonly drawerId = computed(() => this._drawer()?.drawerId);

	constructor() {
		// Re-bind the injected drawer when the explicit reference changes — keeps
		// `_drawer` reactive without re-injection. (No-op when only one source is
		// ever used.)
		effect(() => {
			const explicit = this.brnDrawerTriggerFor();
			if (explicit) this._injectedDrawer = explicit;
		});
	}

	/** Opens the resolved drawer. No-op if no drawer is reachable. */
	public open(): void {
		this._drawer()?.open();
	}
}
