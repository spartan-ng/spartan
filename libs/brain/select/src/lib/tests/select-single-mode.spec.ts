import { Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {
	SelectSingleValueTestComponent,
	SelectSingleValueWithInitialValueTestComponent,
	SelectSingleValueWithInitialValueWithAsyncUpdateTestComponent,
} from './select-reactive-form';
import { getFormControlStatus, getFormValidationClasses } from './utils';

describe('Brn Select Component in single-mode', () => {
	const DEFAULT_LABEL = 'Select a Fruit';
	const INITIAL_VALUE_TEXT = 'Apple';
	const INITIAL_VALUE = 'apple';

	beforeAll(() => {
		global.ResizeObserver = jest.fn().mockImplementation(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));

		window.HTMLElement.prototype.scrollIntoView = jest.fn();
	});

	const setupWithFormValidation = async () => {
		const { fixture } = await render(SelectSingleValueTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	const setupWithFormValidationAndInitialValue = async () => {
		const { fixture } = await render(SelectSingleValueWithInitialValueTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	const setupWithFormValidationAndInitialValueAndAsyncUpdate = async () => {
		const { fixture } = await render(SelectSingleValueWithInitialValueWithAsyncUpdateTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	describe('form validation - single mode', () => {
		it('should reflect correct formcontrol status and value with no initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTestComponent;

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(value.textContent?.trim()).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
		});

		it('should reflect correct formcontrol status and value with initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationAndInitialValue();
			const cmpInstance = fixture.componentInstance;

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(value.textContent?.trim()).toBe(INITIAL_VALUE_TEXT);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(INITIAL_VALUE);
		});

		it('should reflect correct formcontrol status after first user selection with no initial value', async () => {
			const { user, trigger, fixture, value } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTestComponent;

			expect(value.textContent?.trim()).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			// Open Select
			await user.click(trigger);

			const afterOpenExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterOpenExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterOpenExpected);

			// Select option
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			const afterSelectionExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterSelectionExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterSelectionExpected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual('banana');
		});

		it('should reflect correct formcontrol status after first user selection with initial value', async () => {
			const { user, trigger, fixture, value } = await setupWithFormValidationAndInitialValue();
			const cmpInstance = fixture.componentInstance as SelectSingleValueWithInitialValueTestComponent;

			expect(value.textContent?.trim()).toBe(INITIAL_VALUE_TEXT);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(INITIAL_VALUE);

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			// Open Select
			await user.click(trigger);

			const afterOpenExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterOpenExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterOpenExpected);

			// Select option
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			const afterSelectionExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterSelectionExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterSelectionExpected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual('banana');
			expect(screen.getByTestId('brn-select-value').textContent?.trim()).toBe('Banana');
		});

		it('should reflect correct formcontrol status after first user selection with initial value and async update', async () => {
			const { user, trigger, fixture, value } = await setupWithFormValidationAndInitialValueAndAsyncUpdate();
			const cmpInstance = fixture.componentInstance as SelectSingleValueWithInitialValueTestComponent;

			expect(value.textContent?.trim()).toBe(INITIAL_VALUE_TEXT);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(INITIAL_VALUE);

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			// Open Select
			await user.click(trigger);

			const afterOpenExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterOpenExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterOpenExpected);

			// Select option
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			const afterSelectionExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterSelectionExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterSelectionExpected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual('banana');
			expect(value.textContent?.trim()).toBe('Banana');
		});
	});

	describe('form validation - single mode and required', () => {
		it('should reflect correct formcontrol status with no initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTestComponent;

			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

			const expected = {
				untouched: true,
				touched: false,
				valid: false,
				invalid: true,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(value.textContent?.trim()).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
		});

		it('should have the errorState in true when the select has been triggered and no option has been selected', async () => {
			const { user, fixture, trigger } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTestComponent;

			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

			// open
			await user.click(trigger);
			// close
			await user.click(trigger);

			expect(cmpInstance.brnSelectComponent()?.errorState()).toBeTruthy();
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
		});

		it('should reflect initial single value set on formcontrol', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationAndInitialValue();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTestComponent;

			const expected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(value.textContent?.trim()).toBe(INITIAL_VALUE_TEXT);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(INITIAL_VALUE);
		});
	});
});
