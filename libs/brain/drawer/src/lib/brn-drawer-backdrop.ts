// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, inject, input, signal } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/brain/core';
import { BrnDrawer } from './brn-drawer';

/**
 * Styles the overlay backdrop of a modal drawer. The backdrop exposes `data-starting-style`,
 * `data-ending-style`, `data-swiping`, `data-swipe-dismiss`, `--drawer-swipe-progress` and
 * `--drawer-swipe-strength`. Nested drawers keep their backdrop transparent unless `forceRender`.
 */
@Directive({
	selector: '[brnDrawerBackdrop],brn-drawer-backdrop',
	exportAs: 'brnDrawerBackdrop',
	providers: [provideCustomClassSettableExisting(() => BrnDrawerBackdrop)],
})
export class BrnDrawerBackdrop {
	private readonly _drawer = inject(BrnDrawer);
	private readonly _customClass = signal<string | undefined>(undefined);

	public readonly className = input<string | null | undefined>(undefined, { alias: 'class' });
	/** Styles the backdrop of a nested drawer too. */
	public readonly forceRender = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	private readonly _resolvedClass = computed(() =>
		!this._drawer.nested || this.forceRender() ? (this._customClass() ?? this.className()) : null,
	);

	constructor() {
		this._drawer.registerOverlayClass(this._resolvedClass);
	}

	public setClassToCustomElement(newClass: string): void {
		this._customClass.set(newClass);
	}
}
