import { Directive, type Signal, signal } from '@angular/core';
import type { AbstractControl, NgControl, ValidationErrors } from '@angular/forms';
import { ControlState } from '@spartan-ng/brain/forms';

@Directive()
export class BrnFieldControl {
	/** Gets the AbstractControlDirective for this control. */
	public readonly ngControl: NgControl | AbstractControl | null = null;

	public readonly controlState: Signal<ControlState | null> = signal(null);

	public readonly errors: Signal<ValidationErrors | null> = signal(null);
}
