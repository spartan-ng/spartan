import { Directive, type Signal, signal } from '@angular/core';
import type { AbstractControl, NgControl } from '@angular/forms';

export interface BrnFormFieldControlInterface {
	/** Gets the AbstractControlDirective for this control. */
	ngControl: NgControl | AbstractControl | null;

	/** Whether the control is in an error state. */
	errorState: Signal<boolean>;

	/** Whether the control is required. */
	required: Signal<boolean>;

	/** Whether the control is disabled. */
	disabled: Signal<boolean>;

	/** The control's unique ID. */
	id: Signal<string>;

	/** Sets the aria-describedby attribute for accessibility. */
	setAriaDescribedBy?(ids: string): void;
}

@Directive()
export class BrnFormFieldControl implements BrnFormFieldControlInterface {
	public readonly ngControl: NgControl | AbstractControl | null = null;

	public readonly errorState: Signal<boolean> = signal(false);

	public readonly required: Signal<boolean> = signal(false);

	public readonly disabled: Signal<boolean> = signal(false);

	public readonly id: Signal<string> = signal('');

	public setAriaDescribedBy?(ids: string): void;
}
