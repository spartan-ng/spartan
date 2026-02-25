import { computed, Directive, forwardRef, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BrnCombobox } from '@spartan-ng/brain/combobox';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';

import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { provideBrnSelect } from './brn-select.token';

let nextId = 0;

@Directive({
	selector: 'brn-select, [brnSelect]',
	exportAs: 'brnSelect',
	hostDirectives: [
		{
			directive: BrnCombobox,
			inputs: [
				'disabled',
				'value',
				'multiple',
				'placeholder',
				'autoHighlight',
				'filter',
				'search',
				'itemToString: displayWith',
				'filterOptions',
				'isItemEqualToValue',
			],
			outputs: ['valueChange'],
		},
		{
			directive: BrnPopover,
			inputs: [
				'state: open',
				'closeDelay',
				'align',
				'autoFocus',
				'closeOnOutsidePointerEvents',
				'sideOffset',
				'offsetX',
				'restoreFocus',
				'viewportMargin',
			],
			outputs: ['stateChanged: openChange', 'closed'],
		},
	],
	providers: [
		provideBrnSelect(BrnSelect),
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => BrnSelect),
		},
	],
})
export class BrnSelect<T = unknown> implements BrnFormFieldControl {
	private readonly _combobox = inject(BrnCombobox, { self: true });
	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	public readonly ngControl = inject(NgControl, { optional: true, self: true });

	public readonly errorStateTracker: ErrorStateTracker;
	public readonly errorState = computed(() => this.errorStateTracker.errorState());

	public readonly id = input<string>(`brn-select-${++nextId}`);

	constructor() {
		this.errorStateTracker = new ErrorStateTracker(this._defaultErrorStateMatcher, this.ngControl, null, null);
	}

	public readonly value = this._combobox.value;

	public writeValue(value: unknown): void {
		this._combobox.writeValue(value);
	}

	public select(value: unknown): void {
		this._combobox.select(value);
	}
}
