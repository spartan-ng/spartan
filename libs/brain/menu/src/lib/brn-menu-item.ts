import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, Directive, effect, inject, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';

@Directive({
	selector: '[brnMenuItem]',
	hostDirectives: [CdkMenuItem],
	host: {
		'[disabled]': 'disabled()',
		'[attr.data-disabled]': 'disabled() ? "" : null',
	},
})
export class BrnMenuItem {
	private readonly _cdkMenuItem = inject(CdkMenuItem);
	public readonly disabled = input<boolean, BooleanInput>(this._cdkMenuItem.disabled, { transform: booleanAttribute });
	public readonly triggered = outputFromObservable(this._cdkMenuItem.triggered);

	constructor() {
		effect(() => (this._cdkMenuItem.disabled = this.disabled()));
	}
}
