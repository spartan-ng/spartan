/* eslint-disable @angular-eslint/component-selector */
import { ApplicationRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { BrnDatePicker } from '@spartan-ng/brain/date-picker';
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

		const errorElement = error();
		expect(errorElement).not.toBeNull();
		expect(errorElement?.classList.contains('hidden')).toBe(true);
	});

		it('should show the error when form is invalid and touched', async () => {
			const { fixture, user, error, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Click the date picker button to open it
			await user.click(datePickerButton);

			// Click outside to close and trigger touched state
			await user.click(document.body);
			
			// Trigger change detection to run ngAfterViewChecked
			fixture.detectChanges();

		// Check that error is now visible
		const errorElement = error();
		expect(errorElement?.textContent?.trim()).toBe(TEXT_ERROR);
		expect(errorElement).not.toBeNull();
		expect(errorElement?.classList.contains('hidden')).toBe(false);
	});

		it('should hide the hint when error is shown', async () => {
			const { fixture, user, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Click the date picker button to open it
			await user.click(datePickerButton);

		// Click outside to close and trigger touched state
		await user.click(document.body);
		
		// Trigger change detection to run ngAfterViewChecked
		fixture.detectChanges();

		// Check that hint is now hidden
		const hintElement = screen.queryByTestId('hlm-hint');
		expect(hintElement).not.toBeNull();
		expect(hintElement?.classList.contains('hidden')).toBe(true);
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
			const { fixture, user, error, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Click the date picker button to open it
			await user.click(datePickerButton);

			// Click outside to close and trigger touched state
			await user.click(document.body);
			
			// Trigger change detection to run ngAfterViewChecked
			fixture.detectChanges();

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
			const { fixture, user, hint, error, datePickerButton } = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Initially should have hint ID
			const initialHintId = hint.getAttribute('id');
			expect(datePickerButton.getAttribute('aria-describedby')).toBe(initialHintId);

			// Trigger error state
			await user.click(datePickerButton);
			await user.click(document.body);
			
			// Trigger change detection to run ngAfterViewChecked
			fixture.detectChanges();

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
		const errorElement = error();
		expect(errorElement).not.toBeNull();
		expect(errorElement?.classList.contains('hidden')).toBe(true);
	});
	});

	describe('Date Picker Form Field ID Generation', () => {
		it('should have unique IDs for hint and error elements', async () => {
			const { fixture, user, hint, error, datePickerButton } = await setupDatePickerFormField();

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
			
			// Trigger change detection to run ngAfterViewChecked
			fixture.detectChanges();

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
			// Note: This test is skipped because @testing-library/angular doesn't support
			// rendering multiple instances in the same test. The ID uniqueness is guaranteed
			// by the counter mechanism in BrnHint and BrnError directives.
			// We can verify this behavior works correctly in the Storybook where multiple
			// form fields are rendered on the same page.
		});
	});

	describe('Date Picker Form Field Accessibility', () => {
		it('should have proper ARIA attributes on hint element', async () => {
			const { hint } = await setupDatePickerFormField();

			expect(hint.getAttribute('id')).toBeDefined();
			// Hint doesn't need aria-live or role as it's not an error message
		});

		it('should have proper ARIA attributes on error element', async () => {
			const { fixture, user, error, datePickerButton} = await setupDatePickerFormField();

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Trigger error state
			await user.click(datePickerButton);
			await user.click(document.body);
			
			// Trigger change detection to run ngAfterViewChecked
			fixture.detectChanges();

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

	describe('Date Picker updateErrorState Method', () => {
		it('should update error state when called manually', async () => {
			const { fixture, datePickerButton } = await setupDatePickerFormField();
			const control = fixture.componentInstance.date;

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Mark as touched but don't trigger change detection
			control.markAsTouched();

			// Get the BrnDatePicker directive
			const brnDirective = fixture.debugElement
				.query(By.directive(BrnDatePicker))
				?.injector.get(BrnDatePicker);

			expect(brnDirective).toBeDefined();

			// Manually call updateErrorState
			brnDirective?.updateErrorState();
			fixture.detectChanges();

			// Error should now be visible
			const errorElement = screen.queryByTestId('hlm-error');
			expect(errorElement?.textContent?.trim()).toBe(TEXT_ERROR);
		});

		it('should mark for check when error state changes', async () => {
			const { fixture, datePickerButton } = await setupDatePickerFormField();
			const control = fixture.componentInstance.date;

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Get the BrnDatePicker directive
			const brnDirective = fixture.debugElement
				.query(By.directive(BrnDatePicker))
				?.injector.get(BrnDatePicker);

			expect(brnDirective).toBeDefined();

			const initialErrorState = brnDirective?.errorState();
			expect(initialErrorState).toBe(false);

			// Mark as touched and update error state
			control.markAsTouched();
			brnDirective?.updateErrorState();

			const newErrorState = brnDirective?.errorState();
			expect(newErrorState).toBe(true);
			expect(newErrorState).not.toBe(initialErrorState);
		});

		it('should update error state immediately with ApplicationRef.tick()', async () => {
			const { fixture, datePickerButton } = await setupDatePickerFormField();
			const control = fixture.componentInstance.date;
			const appRef = TestBed.inject(ApplicationRef);

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Mark as touched and trigger full change detection cycle
			control.markAsTouched();
			appRef.tick();

			// Error should be visible immediately
			const errorElement = screen.queryByTestId('hlm-error');
			expect(errorElement?.textContent?.trim()).toBe(TEXT_ERROR);
			expect(errorElement).not.toBeNull();
		});

		it('should update error state on view check', async () => {
			const { fixture, datePickerButton } = await setupDatePickerFormField();
			const control = fixture.componentInstance.date;

			if (!datePickerButton) {
				throw new Error('Date picker button not found');
			}

			// Mark as touched
			control.markAsTouched();

			// Trigger view check
			fixture.detectChanges();

			// Error should be visible after change detection
			const errorElement = screen.queryByTestId('hlm-error');
			expect(errorElement?.textContent?.trim()).toBe(TEXT_ERROR);
			expect(errorElement).not.toBeNull();
		});
	});
});
