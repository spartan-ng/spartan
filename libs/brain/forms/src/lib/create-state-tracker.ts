import { isSignal } from '@angular/core';
import type { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import type { ErrorStateMatcher } from './error-options';
import { ReactiveStateTracker } from './reactive-state-tracker';
import { SignalStateTracker } from './signal-state-tracker';
import type { StateTracker } from './state-tracker';

export function createStateTracker(
	ngControl: NgControl,
	matcher: ErrorStateMatcher | null,
	parentFormGroup: FormGroupDirective | null,
	parentForm: NgForm | null,
): StateTracker {
	if (ngControl.control && 'field' in ngControl.control && isSignal(ngControl.control.field)) {
		return new SignalStateTracker(ngControl, matcher, parentFormGroup, parentForm);
	}
	return new ReactiveStateTracker(ngControl, matcher, parentFormGroup, parentForm);
}
