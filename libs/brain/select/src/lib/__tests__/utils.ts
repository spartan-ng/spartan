import type { AbstractControl } from '@angular/forms';

export interface ExpectedFormStatus {
	[key: string]: boolean | string | null;
	untouched: boolean | string | null;
	valid: boolean | string | null;
	pristine: boolean | string | null;
	touched: boolean | string | null;
	invalid: boolean | string | null;
	dirty: boolean | string | null;
}

export const getFormControlStatus = (
	formControl: AbstractControl<string | string[] | null, string | string[] | null> | null,
) => {
	const actualValues: ExpectedFormStatus = {
		untouched: null,
		valid: null,
		pristine: null,
		touched: null,
		invalid: null,
		dirty: null,
	};
	for (const status in actualValues) {
		actualValues[status] = formControl?.[status as keyof typeof formControl] as boolean;
	}
	return actualValues;
};

export const getFormValidationClasses = (el: HTMLElement): ExpectedFormStatus => {
	const actualValues: ExpectedFormStatus = {
		untouched: null,
		valid: null,
		pristine: null,
		touched: null,
		invalid: null,
		dirty: null,
	};
	for (const status in actualValues) {
		actualValues[status] = el.classList.contains(`ng-${status}`);
	}
	return actualValues;
};
