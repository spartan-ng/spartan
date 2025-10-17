import {
	AfterContentInit,
	computed,
	contentChild,
	contentChildren,
	Directive,
	effect,
	input,
	signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { BrnError } from './brn-error';
import { provideBrnFormFieldContext, type BrnFormFieldContextValue } from './brn-form-field-context';
import { BrnFormFieldControl } from './brn-form-field-control';
import { BrnHint } from './brn-hint';

let nextFormFieldId = 0;

@Directive({
	selector: '[brnFormField]',
	providers: [
		provideBrnFormFieldContext({
			control: signal(null),
			errorState: signal(false),
			required: signal(false),
			disabled: signal(false),
			id: signal(`brn-form-field-${++nextFormFieldId}`),
		}),
	],
})
export class BrnFormFieldDirective implements BrnFormFieldContextValue, AfterContentInit {
	public readonly hintChildren = contentChildren(BrnHint);
	public readonly errorChildren = contentChildren(BrnError);
	public readonly formControl = contentChild(BrnFormFieldControl, { descendants: true });

	// Form field configuration
	public readonly required = input<boolean>(false);
	public readonly disabled = input<boolean>(false);
	public readonly id = input<string>(`brn-form-field-${++nextFormFieldId}`);

	// Context state
	public readonly control = signal<NgControl | null>(null);
	public readonly errorState = computed(() => {
		// Use the form control's error state if available, otherwise fall back to basic validation
		const formControl = this.formControl();
		if (formControl && 'errorState' in formControl) {
			return (formControl as any).errorState();
		}
		// Fallback to basic validation check
		const control = this.control();
		return (control?.invalid && control?.touched) ?? false;
	});

	constructor() {
		// Handle ARIA relationships for all form controls
		effect(() => {
			const control = this.formControl();
			const errorState = this.errorState();
			const errorChildren = this.errorChildren();
			const hintChildren = this.hintChildren();

			if (control) {
				const describedByIds: string[] = [];

				// Add error IDs if in error state
				if (errorState && errorChildren.length > 0) {
					describedByIds.push(...errorChildren.map((error) => error.id()));
				}
				// Add hint IDs if not in error state
				else if (hintChildren.length > 0) {
					describedByIds.push(...hintChildren.map((hint) => hint.id()));
				}

				const idsString = describedByIds.join(' ');

				// Handle different types of form controls
				if ('setAriaDescribedBy' in control) {
					// For inputs and other controls with setAriaDescribedBy method
					(control as any).setAriaDescribedBy(idsString);
				} else if ('trigger' in control) {
					// Check if trigger is a signal function
					const triggerValue = typeof control.trigger === 'function' ? control.trigger() : control.trigger;

					if (
						triggerValue &&
						typeof triggerValue === 'object' &&
						triggerValue !== null &&
						'setAriaDescribedBy' in triggerValue
					) {
						// For select components, set ARIA on the trigger
						(triggerValue as any).setAriaDescribedBy(idsString);
					}
				}
			}
		});
	}

	ngAfterContentInit() {
		if (this.formControl()) {
			this.control.set(this.formControl()?.ngControl as NgControl | null);
		}
	}
}
