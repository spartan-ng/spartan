import { Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {
	SelectMultiValueTestComponent,
	SelectMultiValueWithInitialValueTestComponent,
	SelectMultiValueWithInitialValueWithForLoopTestComponent,
} from './select-reactive-form';
import { getFormControlStatus, getFormValidationClasses } from './utils';

describe('Brn Select Component in multi-mode', () => {
	beforeAll(() => {
		global.ResizeObserver = jest.fn().mockImplementation(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));
	});

	const DEFAULT_LABEL = 'Select a Fruit';

	const setupWithFormValidationMulti = async () => {
		const { fixture } = await render(SelectMultiValueTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	const setupWithFormValidationMultiWithInitialValue = async () => {
		const { fixture } = await render(SelectMultiValueWithInitialValueTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
		};
	};

	const setupWithFormValidationMultiWithInitialValueWithForLoop = async () => {
		const { fixture } = await render(SelectMultiValueWithInitialValueWithForLoopTestComponent);
		return {
			user: userEvent.setup(),
			fixture,
			trigger: screen.getByTestId('brn-select-trigger'),
			value: screen.getByTestId('brn-select-value'),
			updateOptionsBtn: screen.getByTestId('update-options-btn'),
			updatePartialOptionsBtn: screen.getByTestId('partial-options-btn'),
			updateDiffOptionsBtn: screen.getByTestId('diff-options-btn'),
		};
	};

	describe('form validation - multi mode', () => {
		it('should become dirty only after an actual user option selection', async () => {
			const { user, fixture, trigger } = await setupWithFormValidationMulti();
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

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			// open
			await user.click(trigger);
			// close
			await user.click(trigger);

			// Patch Value
			expect(cmpInstance.form?.get('fruit')?.patchValue(['apple', 'banana', 'blueberry']));

			// validate patch value
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);
			fixture.detectChanges();

			const afterValuePatchExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterValuePatchExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterValuePatchExpected);
		});

		// should have correct status when initialized with no value and as optional
		it('should reflect correct form control status with no initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance as SelectMultiValueTestComponent;

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

		it('should reflect correct form control status with initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationMultiWithInitialValue();
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

			expect(value.textContent?.trim()).toBe('Apple, Blueberry');
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'blueberry']);
		});

		it('should reflect correct form control status and value after first user selection with no initial value', async () => {
			const { fixture, trigger, user } = await setupWithFormValidationMulti();
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

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			// open select
			await user.click(trigger);

			// Make 1st selection
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			// status prior to closing select
			const afterFirstSelectionExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterFirstSelectionExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterFirstSelectionExpected);

			// close select
			await user.click(trigger);

			// validate status and value
			const afterClose = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterClose);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterClose);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['banana']);
		});

		it('should reflect correct form control status and value after patching value with no initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidationMulti();
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

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			expect(cmpInstance.form?.get('fruit')?.patchValue(['apple', 'banana', 'blueberry']));

			// validate patch value
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);

			const afterValuePatchExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterValuePatchExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterValuePatchExpected);
		});

		it('should reflect correct form control status and value after first user selection with initial value', async () => {
			const { fixture, trigger, user } = await setupWithFormValidationMulti();
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

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			// open select
			await user.click(trigger);

			// Make 1st selection
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			// status prior to closing select
			const afterFirstSelectionExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterFirstSelectionExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterFirstSelectionExpected);

			// close select
			await user.click(trigger);

			// validate status and value
			const afterCloseExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterCloseExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterCloseExpected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['banana']);
		});

		it('should reflect correct form control status and value after patching value with initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidationMulti();
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

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			expect(cmpInstance.form?.get('fruit')?.patchValue(['apple', 'banana', 'blueberry']));

			// validate patch value
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);

			const afterValuePatchExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterValuePatchExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterValuePatchExpected);
		});

		/**
		 * Update Options
		 */
		it('should reset display but not value if options change and are completely different', async () => {
			const { fixture, trigger, updateDiffOptionsBtn, user } =
				await setupWithFormValidationMultiWithInitialValueWithForLoop();
			const cmpInstance = fixture.componentInstance;

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'pineapple']);

			// update with
			await user.click(updateDiffOptionsBtn);

			//display should be updated
			expect(trigger).toHaveTextContent('Select a Fruit');

			// value should remain same
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'pineapple']);
		});

		it('should update display but not value if options updated and only some options are same', async () => {
			const { fixture, trigger, updatePartialOptionsBtn, user } =
				await setupWithFormValidationMultiWithInitialValueWithForLoop();
			const cmpInstance = fixture.componentInstance;

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'pineapple']);

			// actionBtn.
			await user.click(updatePartialOptionsBtn);

			//display should be updated
			expect(trigger).toHaveTextContent('Apple');

			// expect value to remain same
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'pineapple']);
		});

		it('should maintain exact display and value if options updated but exactly same', async () => {
			const { fixture, trigger, updateOptionsBtn, user } =
				await setupWithFormValidationMultiWithInitialValueWithForLoop();
			const cmpInstance = fixture.componentInstance;

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'pineapple']);

			// actionBtn.
			user.click(updateOptionsBtn);

			// open select
			await user.click(trigger);

			// display should be same
			expect(trigger).toHaveTextContent('Apple, Pineapple');

			// value should be same
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'pineapple']);
		});
	});

	describe('form validation - multi mode and required', () => {
		/**
		 * No Initial Value
		 */
		it('should reflect correct form control status with no initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance;

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

		/**
		 * Initial Value
		 */
		// should initialize with correct status and initial value when required
		it('should reflect correct form control status with initial value', async () => {
			const { fixture, trigger, value } = await setupWithFormValidationMultiWithInitialValue();
			const cmpInstance = fixture.componentInstance;

			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

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

			expect(value.textContent?.trim()).toBe('Apple, Blueberry');
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'blueberry']);
		});

		/**
		 * User Selection with no initial value
		 */
		it('should reflect correct form control status and value after first user selection with no initial value', async () => {
			const { fixture, trigger, user } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance;

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

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			// open select
			await user.click(trigger);

			// Make 1st selection
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			// status prior to closing select
			const afterFirstSelectioneExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterFirstSelectioneExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterFirstSelectioneExpected);

			// close select
			await user.click(trigger);

			// validate status and value
			const afterCloseExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterCloseExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterCloseExpected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['banana']);
		});

		/**
		 * User Selection with initial value
		 */
		it('should reflect correct form control status and value after first user selection with initial value', async () => {
			const { fixture, trigger, user } = await setupWithFormValidationMultiWithInitialValue();
			const cmpInstance = fixture.componentInstance;

			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

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

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'blueberry']);

			// open select
			await user.click(trigger);

			// Make 1st selection
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			// status prior to closing select
			const afterFirstSelectionExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterFirstSelectionExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterFirstSelectionExpected);

			// close select
			await user.click(trigger);

			// validate status and value
			const afterCloseExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterCloseExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterCloseExpected);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);
		});

		/**
		 * User Selection with initial value when options are dynamically added with a for-loop
		 */
		it('should reflect correct form control status and value after first user selection with initial value with dynamic options', async () => {
			const { fixture, trigger, value, user } = await setupWithFormValidationMultiWithInitialValueWithForLoop();
			const cmpInstance = fixture.componentInstance as SelectMultiValueWithInitialValueWithForLoopTestComponent;

			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

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

			fixture.detectChanges();

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'pineapple']);

			expect(value.textContent?.trim()).toBe('Apple, Pineapple');

			// open select
			await user.click(trigger);

			// Make 1st selection
			const options = await screen.getAllByRole('option');
			await user.click(options[1]);

			// status prior to closing select
			const afterFirstSelectionExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterFirstSelectionExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterFirstSelectionExpected);

			// close select
			await user.click(trigger);

			// validate status and value
			const afterCloseExpected = {
				untouched: false,
				touched: true,
				valid: true,
				invalid: false,
				pristine: false,
				dirty: true,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterCloseExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterCloseExpected);
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'pineapple']);
		});

		/**
		 * Patch value with no initial value
		 */
		it('should reflect correct form control status and value after patching value with no initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidationMulti();
			const cmpInstance = fixture.componentInstance;

			// Setting to be required
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

			// Some issue
			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(expected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(expected);

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(null);

			expect(cmpInstance.form?.get('fruit')?.patchValue(['apple', 'banana', 'blueberry']));

			// validate patch value
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);
			fixture.detectChanges();

			const afterValuePatchExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterValuePatchExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterValuePatchExpected);
		});

		/**
		 * Patch value with initial value
		 */
		it('should reflect correct form control status and value after patching value with initial value', async () => {
			const { fixture, trigger } = await setupWithFormValidationMultiWithInitialValue();
			const cmpInstance = fixture.componentInstance;

			// Setting to be required
			cmpInstance.form?.get('fruit')?.addValidators(Validators.required);
			cmpInstance.form?.get('fruit')?.updateValueAndValidity();
			fixture.detectChanges();

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

			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'blueberry']);

			expect(cmpInstance.form?.get('fruit')?.patchValue(['apple', 'banana', 'blueberry']));

			// validate patch value
			expect(cmpInstance.form?.get('fruit')?.value).toEqual(['apple', 'banana', 'blueberry']);

			const afterValuePatchExpected = {
				untouched: true,
				touched: false,
				valid: true,
				invalid: false,
				pristine: true,
				dirty: false,
			};

			expect(getFormControlStatus(cmpInstance.form?.get('fruit'))).toStrictEqual(afterValuePatchExpected);
			expect(getFormValidationClasses(trigger)).toStrictEqual(afterValuePatchExpected);
		});
	});
});
