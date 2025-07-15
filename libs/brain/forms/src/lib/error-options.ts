import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, NgForm } from '@angular/forms';

/** Error state matcher that matches when a control is invalid and dirty. */
@Injectable()
export class ShowOnDirtyErrorStateMatcher implements ErrorStateMatcher {
	isInvalid(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
		return !!(control && control.invalid && (control.dirty || (form instanceof NgForm && form.submitted)));
	}
}

/** Provider that defines how form controls behave with regards to displaying error messages. */
@Injectable({ providedIn: 'root' })
export class ErrorStateMatcher {
	isInvalid(control: AbstractControl | null, form: FormGroup | NgForm | null): boolean {
		return !!(control && control.invalid && (control.touched || (form instanceof NgForm && form.submitted)));
	}
}
