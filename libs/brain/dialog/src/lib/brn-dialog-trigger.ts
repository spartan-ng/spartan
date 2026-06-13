import { computed, Directive, inject, input } from '@angular/core';
import { BrnDialog } from './brn-dialog';
import { BrnDialogRef } from './brn-dialog-ref';
import type { BrnDialogState } from './brn-dialog-state';

let triggerIdSequence = 0;

@Directive({
	selector: 'button[brnDialogTrigger],button[brnDialogTriggerFor]',
	exportAs: 'brnDialogTrigger',
	host: {
		'[id]': 'id()',
		'(click)': 'open()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true' : 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'dialogId()',
		'[type]': 'type()',
	},
})
export class BrnDialogTrigger {
	private readonly _injectedDialog = inject(BrnDialog, { optional: true });
	private readonly _dialogRef = inject(BrnDialogRef, { optional: true });

	public readonly id = input<string>(`brn-dialog-trigger-${++triggerIdSequence}`);
	public readonly type = input<'button' | 'submit' | 'reset'>('button');
	public readonly brnDialogTriggerFor = input<BrnDialog | undefined>(undefined, {
		alias: 'brnDialogTriggerFor',
	});

	public readonly state = computed<BrnDialogState>(
		() => this.getDialog()?.stateComputed() ?? this._dialogRef?.state() ?? 'closed',
	);
	public readonly dialogId = computed(() => this.getDialog()?.id() ?? this._dialogRef?.id ?? null);

	protected getDialog(): BrnDialog | undefined {
		return this.brnDialogTriggerFor() ?? this._injectedDialog ?? undefined;
	}

	public open(): void {
		this.getDialog()?.open();
	}
}
