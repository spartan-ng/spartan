import { Injectable, type Provider, type Type } from '@angular/core';
import { type AbstractControl, type FormGroupDirective, NgForm } from '@angular/forms';

/**
 * Provides a custom {@link ErrorStateMatcher} at the component or application level.
 *
 * @example <caption>Application-level (appConfig)</caption>
 * ```ts
 * provideErrorStateMatcher(ShowOnDirtyErrorStateMatcher)
 * ```
 *
 * @example <caption>Component-level</caption>
 * ```ts
 * providers: [provideErrorStateMatcher(ShowOnDirtyErrorStateMatcher)]
 * ```
 */
export function provideErrorStateMatcher(matcher: Type<ErrorStateMatcher>): Provider {
	return { provide: ErrorStateMatcher, useClass: matcher };
}

/** Error state matcher that matches when a control is invalid and dirty. */
@Injectable()
export class ShowOnDirtyErrorStateMatcher implements ErrorStateMatcher {
	isInvalid(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
		return !!(control && control.invalid && (control.dirty || (form instanceof NgForm && form.submitted)));
	}
}

/**
 * Determines when a form control should be considered in an invalid (error) state.
 *
 * The return value of `isInvalid` is reflected as the `data-matches-spartan-invalid` attribute
 * on field components, which drives both error styling and the visibility of `HlmFieldError`
 * messages.
 *
 * The default implementation matches when the control is invalid and either touched or, for
 * template-driven forms, the parent `NgForm` has been submitted.
 *
 * Provide a custom implementation (e.g. `ShowOnDirtyErrorStateMatcher`) at the component or
 * application level to change when errors are shown.
 */
@Injectable({ providedIn: 'root' })
export class ErrorStateMatcher {
	isInvalid(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
		return !!(control && control.invalid && (control.touched || (form instanceof NgForm && form.submitted)));
	}
}
