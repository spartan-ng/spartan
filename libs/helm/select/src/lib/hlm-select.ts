import { computed, Directive, forwardRef, inject, input, booleanAttribute, type Signal } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BrnCombobox, injectBrnComboboxBase } from '@spartan-ng/brain/combobox';
import { BrnPopover, provideBrnPopoverConfig } from '@spartan-ng/brain/popover';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';
import type { BooleanInput } from '@angular/cdk/coercion';

let nextId = 0;

@Directive({
	selector: '[hlmSelect],hlm-select',
	exportAs: 'brnSelect',
	providers: [
		{
			provide: BrnFormFieldControl,
			useExisting: forwardRef(() => HlmSelect),
		},
		provideBrnPopoverConfig({
			align: 'start',
			sideOffset: 6,
			viewportMargin: 16,
		}),
		provideBrnDialogDefaultOptions({
			autoFocus: 'first-heading',
		}),
	],
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
})
export class HlmSelect<T = any> implements BrnFormFieldControl {
	private readonly _combobox = injectBrnComboboxBase<T>();
	private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
	public readonly ngControl = inject(NgControl, { optional: true, self: true });

	public readonly errorStateTracker: ErrorStateTracker;
	public readonly errorState = computed(() => this.errorStateTracker.errorState());

	public readonly id = input<string>(`hlm-select-${++nextId}`);

	constructor() {
		this.errorStateTracker = new ErrorStateTracker(
			this._defaultErrorStateMatcher,
			this.ngControl,
			null,
			null,
		);
	}

	public readonly value = this._combobox.value;
}
