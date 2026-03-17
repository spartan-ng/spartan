import { Directive, ElementRef, inject, input } from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: 'button[brnSelectTrigger]',
	host: {
		role: 'combobox',
		'[id]': 'id()',
		'[attr.aria-expanded]': '_isExpanded()',
		'(click)': 'open()',
		'(keydown)': 'onKeyDown($event)',
	},
})
export class BrnSelectTrigger {
	private static _id = 0;

	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnDialog = inject(BrnDialog, { optional: true });

	private readonly _select = injectBrnSelectBase();

	public readonly id = input<string>(`brn-select-trigger-${++BrnSelectTrigger._id}`);

	/** Whether the combobox panel is expanded */
	protected readonly _isExpanded = this._select.isExpanded;

	constructor() {
		if (!this._brnDialog) return;

		this._brnDialog.mutableAttachTo.set(this._host.nativeElement);
	}

	protected open() {
		this._brnDialog?.open();
	}

	/** Listen for keydown events */
	protected onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			// prevent form submission if inside a form
			event.preventDefault();

			this._select.selectActiveItem();
		}

		this._select.keyManager.onKeydown(event);
	}
}
