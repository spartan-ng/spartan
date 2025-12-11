import { Directive, type Signal, signal } from '@angular/core';
import type { AbstractControl, NgControl } from '@angular/forms';

@Directive()
export class BrnFormFieldControl {
	/** Gets the AbstractControlDirective for this control. */
	public readonly ngControl: NgControl | AbstractControl | null = null;

	/** Whether the control is in an error state. */
	public readonly errorState: Signal<boolean> = signal(false);
}
