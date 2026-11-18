import { type FormGroupDirective, FormResetEvent, FormSubmittedEvent, type NgForm } from '@angular/forms';
import type { Subscription } from 'rxjs';

/**
 * Calls `onChange` when the parent form is submitted or reset, which changes its `submitted` state.
 *
 * Neither emits an event on a child control that is not part of the form (e.g. a standalone
 * `ngModel`), and `submitted` is read untracked, so a matcher depending on it would stay stale.
 * `onChange` only has to invalidate the cached state: the matcher runs again when the state is
 * next read, after `resetForm()` has cleared `submitted`.
 */
export function onParentFormSubmitOrReset(
	parent: FormGroupDirective | NgForm | null,
	onChange: () => void,
): Subscription | undefined {
	return parent?.form?.events?.subscribe((event) => {
		if (event instanceof FormSubmittedEvent || event instanceof FormResetEvent) onChange();
	});
}
