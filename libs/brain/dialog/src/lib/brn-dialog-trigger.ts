import { computed, Directive, effect, inject, input, signal } from '@angular/core';
import { BrnDialog } from './brn-dialog';
import { BrnDialogRef } from './brn-dialog-ref';
import type { BrnDialogState } from './brn-dialog-state';

let idSequence = 0;

@Directive({
	selector: 'button[brnDialogTrigger],button[brnDialogTriggerFor]',
	exportAs: 'brnDialogTrigger',
	host: {
		'[id]': 'id()',
		'(click)': 'open()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'dialogId',
		'[type]': 'type()',
	},
})
export class BrnDialogTrigger {
	protected _brnDialog = inject(BrnDialog, { optional: true });
	protected readonly _brnDialogRef = inject(BrnDialogRef, { optional: true });

	public readonly id = input<string>(`brn-dialog-trigger-${++idSequence}`);
	public readonly type = input<'button' | 'submit' | 'reset'>('button');

	public readonly state = computed<BrnDialogState>(() => {
		// If we have a dialog component from the input, use its state (the highest priority)
		const dialogFromInput = this.brnDialogTriggerForState();
		if (dialogFromInput) {
			return dialogFromInput.stateComputed();
		}

		// If we have a dialog component, use its state
		if (this._brnDialog) {
			return this._brnDialog.stateComputed();
		}

		// If we have a dialog ref, use its state
		if (this._brnDialogRef) {
			return this._brnDialogRef.state();
		}

		return 'closed';
	});

	public readonly dialogId = `brn-dialog-${this._brnDialogRef?.dialogId ?? ++idSequence}`;

	public readonly brnDialogTriggerFor = input<BrnDialog | undefined>(undefined, {
		alias: 'brnDialogTriggerFor',
	});
	public readonly mutableBrnDialogTriggerFor = computed(() => signal(this.brnDialogTriggerFor()));
	public readonly brnDialogTriggerForState = computed(() => this.mutableBrnDialogTriggerFor()());

	constructor() {
		effect(() => {
			const brnDialog = this.brnDialogTriggerForState();
			if (!brnDialog) return;
			this._brnDialog = brnDialog;
		});
	}

	open() {
		this._brnDialog?.open();
	}
}
