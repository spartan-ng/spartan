import type { Signal } from '@angular/core';
import type { ValidationErrors } from '@angular/forms';
import type { ControlState } from './control-state';

export interface StateTracker {
	readonly controlState: Signal<ControlState | null>;
	readonly errors: Signal<ValidationErrors | null>;
	readonly dirty: Signal<boolean | null>;
	readonly invalid: Signal<boolean | null>;
	readonly spartanInvalid: Signal<boolean | null>;
	readonly touched: Signal<boolean | null>;

	destroy(): void;
}

export function controlStateEqual(a: ControlState | null, b: ControlState | null): boolean {
	return (
		a === b ||
		(a != null &&
			b != null &&
			a.dirty === b.dirty &&
			a.invalid === b.invalid &&
			a.touched === b.touched &&
			a.spartanInvalid === b.spartanInvalid &&
			a.errors === b.errors)
	);
}
