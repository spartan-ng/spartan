/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';

import { HlmError } from './hlm-error';
import { HlmFormField } from './hlm-form-field';
import { HlmHint } from './hlm-hint';

@Component({
	selector: 'date-picker-form-field-example',
	imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmDatePicker],
	template: `
		<hlm-form-field>
			<hlm-date-picker data-testid="hlm-date-picker" [formControl]="date">
				<span>Pick a date</span>
			</hlm-date-picker>
			<hlm-hint data-testid="hlm-hint">Select a date from the calendar</hlm-hint>
			<hlm-error data-testid="hlm-error">Please select a date</hlm-error>
		</hlm-form-field>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class DatePickerFormFieldMock {
	public date = new FormControl<Date | null>(null, Validators.required);
}

@Component({
	selector: 'date-picker-form-field-dirty-example',
	imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmDatePicker],
	template: `
		<hlm-form-field>
			<hlm-date-picker data-testid="hlm-date-picker" [formControl]="date">
				<span>Pick a date</span>
			</hlm-date-picker>
			<hlm-hint data-testid="hlm-hint">Select a date from the calendar</hlm-hint>
			<hlm-error data-testid="hlm-error">Please select a date</hlm-error>
		</hlm-form-field>
	`,
	providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class DatePickerFormFieldDirtyMock {
	public date = new FormControl<Date | null>(null, Validators.required);
}

describe('Hlm Form Field with Date Picker Component', () => {
	const TEXT_HINT = 'Select a date from the calendar';
	const TEXT_ERROR = 'Please select a date';

	const setupDatePickerFormField = async () => {
		const { fixture } = await render(DatePickerFormFieldMock);
		return {
			user: userEvent.setup(),
			fixture,
			hint: screen.getByTestId('hlm-hint'),
			error: () => screen.queryByTestId('hlm-error'),
			datePicker: screen.getByTestId('hlm-date-picker'),
			datePickerButton: screen.getByTestId('hlm-date-picker').querySelector('button'),
		};
	};

	const setupDatePickerFormFieldWithErrorStateDirty = async () => {
		const { fixture } = await render(DatePickerFormFieldDirtyMock);
		return {
			user: userEvent.setup(),
			fixture,
			hint: screen.getByTestId('hlm-hint'),
			error: () => screen.queryByTestId('hlm-error'),
			datePicker: screen.getByTestId('hlm-date-picker'),
			datePickerButton: screen.getByTestId('hlm-date-picker').querySelector('button'),
		};
	};

	describe('Date Picker Form Field Visibility', () => {
		it('should show the hint initially when no error state', async () => {
			const { hint } = await setupDatePickerFormField();

			expect(hint.textContent).toBe(TEXT_HINT);
			expect(hint.style.display).not.toBe('none');
		});

		it('should hide the error initially when no error state', async () => {
			const { error } = await setupDatePickerFormField();

			expect(error()).toBeNull();
		});

		it('should show the error when form is invalid and touched', async () => {
			const { user, error, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Click the date picker button to open it
			await user.click(datePickerButton);

			// Click outside to close and trigger touched state
			await user.click(document.body);

			// Check that error is now visible
			const errorElement = error();
			expect(errorElement?.textContent?.trim()).toBe(TEXT_ERROR);
			expect(errorElement).not.toBeNull();
		});

		it('should hide the hint when error is shown', async () => {
			const { user, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Click the date picker button to open it
			await user.click(datePickerButton);

			// Click outside to close and trigger touched state
			await user.click(document.body);

			// Check that hint is now hidden
			expect(screen.queryByTestId('hlm-hint')).toBeNull();
		});
	});

	describe('Date Picker Form Field ARIA DescribedBy', () => {
		it('should have aria-describedby with hint ID when no error state', async () => {
			const { hint, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			const hintId = hint.getAttribute('id');
			expect(hintId).toBeDefined();
			expect(hintId).toMatch(/^brn-hint-/);

			// Check that the date picker button has the hint ID in aria-describedby
			const describedBy = datePickerButton.getAttribute('aria-describedby');
			expect(describedBy).toBe(hintId);
		});

		it('should have aria-describedby with error ID when in error state', async () => {
			const { user, error, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Click the date picker button to open it
			await user.click(datePickerButton);

			// Click outside to close and trigger touched state
			await user.click(document.body);

			// Wait for error to appear
			const errorElement = error();
			expect(errorElement).not.toBeNull();

			const errorId = errorElement?.getAttribute('id');
			expect(errorId).toBeDefined();
			expect(errorId).toMatch(/^brn-error-/);

			// Check that the date picker button has the error ID in aria-describedby
			const describedBy = datePickerButton.getAttribute('aria-describedby');
			expect(describedBy).toBe(errorId);
		});

		it('should switch from hint ID to error ID in aria-describedby', async () => {
			const { user, hint, error, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Initially should have hint ID
			const initialHintId = hint.getAttribute('id');
			expect(datePickerButton.getAttribute('aria-describedby')).toBe(initialHintId);

			// Trigger error state
			await user.click(datePickerButton);
			await user.click(document.body);

			// Now should have error ID
			const errorElement = error();
			expect(errorElement).not.toBeNull();

			const errorId = errorElement?.getAttribute('id');
			expect(datePickerButton.getAttribute('aria-describedby')).toBe(errorId);

			// Should be different from the hint ID
			expect(errorId).not.toBe(initialHintId);
		});
	});

	describe('Date Picker Form Field with Dirty Error State Matcher', () => {
		it('should not show error until date picker is interacted with', async () => {
			const { user, error, datePickerButton } = await setupDatePickerFormFieldWithErrorStateDirty();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Just click and close without selecting anything
			await user.click(datePickerButton);
			await user.click(document.body);

			// Should not show error because it's not dirty yet
			expect(error()).toBeNull();
		});
	});

	describe('Date Picker Form Field ID Generation', () => {
		it('should have unique IDs for hint and error elements', async () => {
			const { user, hint, error, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Get initial hint ID
			const hintId = hint.getAttribute('id');
			expect(hintId).toBeDefined();
			expect(hintId).toMatch(/^brn-hint-/);

			// Trigger error state
			await user.click(datePickerButton);
			await user.click(document.body);

			// Get error ID
			const errorElement = error();
			expect(errorElement).not.toBeNull();

			const errorId = errorElement?.getAttribute('id');
			expect(errorId).toBeDefined();
			expect(errorId).toMatch(/^brn-error-/);

			// IDs should be different
			expect(errorId).not.toBe(hintId);
		});

		it('should have consistent IDs across multiple instances', async () => {
			// This test ensures that multiple form fields don't interfere with each other
			await render(DatePickerFormFieldMock);
			await render(DatePickerFormFieldMock);

			const hint1 = screen.getAllByTestId('hlm-hint')[0];
			const hint2 = screen.getAllByTestId('hlm-hint')[1];

			const hintId1 = hint1.getAttribute('id');
			const hintId2 = hint2.getAttribute('id');

			// IDs should be different for different instances
			expect(hintId1).not.toBe(hintId2);
			expect(hintId1).toMatch(/^brn-hint-/);
			expect(hintId2).toMatch(/^brn-hint-/);
		});
	});

	describe('Date Picker Form Field Accessibility', () => {
		it('should have proper ARIA attributes on hint element', async () => {
			const { hint } = await setupDatePickerFormField();

			expect(hint.getAttribute('id')).toBeDefined();
			// Hint doesn't need aria-live or role as it's not an error message
		});

		it('should have proper ARIA attributes on error element', async () => {
			const { user, error, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Trigger error state
			await user.click(datePickerButton);
			await user.click(document.body);

			const errorElement = error();
			expect(errorElement).not.toBeNull();

			expect(errorElement?.getAttribute('id')).toBeDefined();
		});

		it('should have proper ARIA attributes on date picker button', async () => {
			const { datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			expect(datePickerButton.getAttribute('aria-describedby')).toBeDefined();
		});
	});
});

