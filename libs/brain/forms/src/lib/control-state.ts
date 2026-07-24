import type { ValidationErrors } from '@angular/forms';

export interface ControlState {
	dirty: boolean;
	errors: ValidationErrors | null;
	invalid: boolean;
	spartanInvalid: boolean;
	touched: boolean;
}
