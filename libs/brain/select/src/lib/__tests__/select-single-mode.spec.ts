import { Validators } from '@angular/forms';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {
	SelectSingleValueTest,
	SelectSingleValueWithDisplayWithTest,
	SelectSingleValueWithInitialValueTest,
	SelectSingleValueWithInitialValueWithAsyncUpdateTest,
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
		const { fixture } = await render(SelectSingleValueTest);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
		};
	};

	const setupWithFormValidationAndInitialValue = async () => {
		const { fixture } = await render(SelectSingleValueWithInitialValueTest);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
		};
	};

	const setupWithFormValidationAndInitialValueAndAsyncUpdate = async () => {
		const { fixture } = await render(SelectSingleValueWithInitialValueWithAsyncUpdateTest);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
		};
	};

	describe('form validation - single mode', () => {
		it('should reflect correct formcontrol status and value with no initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTest;

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

			expect((trigger as HTMLInputElement).value).toBe('');
			expect(trigger.getAttribute('placeholder')).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
		});

		it('should reflect correct formcontrol status and value with initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidationAndInitialValue();
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

			expect((trigger as HTMLInputElement).value).toBe(INITIAL_VALUE);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(INITIAL_VALUE);
		});

		it('should reflect correct formcontrol status after first user selection with no initial value', async () => {
			const { user, trigger, fixture } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTest;

			expect((trigger as HTMLInputElement).value).toBe('');
			expect(trigger.getAttribute('placeholder')).toBe(DEFAULT_LABEL);
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
			const { user, trigger, fixture } = await setupWithFormValidationAndInitialValue();
			const cmpInstance = fixture.componentInstance as SelectSingleValueWithInitialValueTest;

			expect((trigger as HTMLInputElement).value).toBe(INITIAL_VALUE);
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
			expect((screen.getByTestId('brn-select-trigger') as HTMLInputElement).value).toBe('Banana');
		});

		it('should reflect correct formcontrol status after first user selection with initial value and async update', async () => {
			const { user, trigger, fixture } = await setupWithFormValidationAndInitialValueAndAsyncUpdate();
			const cmpInstance = fixture.componentInstance as SelectSingleValueWithInitialValueTest;

			expect((trigger as HTMLInputElement).value).toBe(INITIAL_VALUE);
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
			expect((trigger as HTMLInputElement).value).toBe('Banana');
		});
	});

	describe('form validation - single mode and required', () => {
		it('should reflect correct formcontrol status with no initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTest;

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

			expect((trigger as HTMLInputElement).value).toBe('');
			expect(trigger.getAttribute('placeholder')).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
		});

		it('should have the errorState in true when the select has been triggered and no option has been selected', async () => {
			const { user, fixture, trigger } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTest;

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
			const { fixture, trigger } = await setupWithFormValidationAndInitialValue();
			const cmpInstance = fixture.componentInstance as unknown as SelectSingleValueTest;

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

			expect((trigger as HTMLInputElement).value).toBe(INITIAL_VALUE);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(INITIAL_VALUE);
		});
	});

	describe('displayValue with displayWith', () => {
		it('should show label from displayWith before first open', async () => {
			await render(SelectSingleValueWithDisplayWithTest, {
				componentInputs: {
					displayWith: (v: string) => (v === 'apple' ? 'Apple' : v),
				},
			});
			const trigger = screen.getByTestId('brn-select-trigger') as HTMLInputElement;
			expect(trigger.value).toBe('Apple');
		});

		it('should show raw value when no displayWith provided and overlay not yet opened', async () => {
			await render(SelectSingleValueWithDisplayWithTest);
			const trigger = screen.getByTestId('brn-select-trigger') as HTMLInputElement;
			expect(trigger.value).toBe('apple');
		});
	});

	describe('keyboard navigation', () => {
		it('should open the select and navigate to options using keyboard', async () => {
			const { user, trigger, fixture } = await setupWithFormValidation();
			const cmpInstance = fixture.componentInstance as SelectSingleValueTest;

			expect((trigger as HTMLInputElement).value).toBe('');
			expect(trigger.getAttribute('placeholder')).toBe(DEFAULT_LABEL);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);
			// Focus the trigger
			await user.tab();
			expect(trigger).toHaveFocus();
			// Open Select
			await user.keyboard(' ');
			const options = screen.getAllByRole('option');
			expect(options[0]).toHaveFocus();
			// Navigate to second option

			await user.keyboard(' ');

			expect((trigger as HTMLInputElement).value).toBe('Apple');
			expect(cmpInstance.form?.get('fruit')?.value).toEqual('apple');

			await waitFor(() => expect(screen.queryByTestId('brn-select-content')).toBeNull());
			await user.keyboard(' ');
			await waitFor(() => expect(screen.getByTestId('brn-select-content')).toBeVisible());

			expect((trigger as HTMLInputElement).value).toBe('Apple');
			expect(cmpInstance.form?.get('fruit')?.value).toEqual('apple');
		});
	});
});
