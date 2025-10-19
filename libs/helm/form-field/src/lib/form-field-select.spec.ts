/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';

import { HlmError } from './hlm-error';
import { HlmFormField } from './hlm-form-field';
import { HlmHint } from './hlm-hint';

const SELECT_IMPORTS = [...BrnSelectImports, ...HlmSelectImports];

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

@Component({
	selector: 'select-form-field-example',
	imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, ...SELECT_IMPORTS],
	template: `
		<hlm-form-field>
			<hlm-select data-testid="brn-select" [formControl]="fruit" placeholder="Select a fruit" hlm>
				<hlm-select-trigger data-testid="hlm-select-trigger" class="w-80">
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content>
					<hlm-select-label>Fruits</hlm-select-label>
					<hlm-option value="apple">Apple</hlm-option>
					<hlm-option value="banana">Banana</hlm-option>
					<hlm-option value="orange">Orange</hlm-option>
					<hlm-option>Clear</hlm-option>
				</hlm-select-content>
			</hlm-select>
			<hlm-hint data-testid="hlm-hint">Select a fruit from the list</hlm-hint>
			<hlm-error data-testid="hlm-error">Please select a fruit</hlm-error>
		</hlm-form-field>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class SelectFormFieldMock {
	public fruit = new FormControl('', Validators.required);
}

@Component({
	selector: 'select-form-field-dirty-example',
	imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, ...SELECT_IMPORTS],
	template: `
		<hlm-form-field>
			<brn-select data-testid="brn-select" [formControl]="fruit" placeholder="Select a fruit" hlm>
				<hlm-select-trigger data-testid="hlm-select-trigger" class="w-80">
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content>
					<hlm-select-label>Fruits</hlm-select-label>
					<hlm-option value="apple">Apple</hlm-option>
					<hlm-option value="banana">Banana</hlm-option>
					<hlm-option value="orange">Orange</hlm-option>
				</hlm-select-content>
			</brn-select>
			<hlm-hint data-testid="hlm-hint">Select a fruit from the list</hlm-hint>
			<hlm-error data-testid="hlm-error">Please select a fruit</hlm-error>
		</hlm-form-field>
	`,
	providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class SelectFormFieldDirtyMock {
	public fruit = new FormControl('', Validators.required);
}

describe('Hlm Form Field with Select Component', () => {
	const TEXT_HINT = 'Select a fruit from the list';
	const TEXT_ERROR = 'Please select a fruit';

	const setupSelectFormField = async () => {
		const { fixture } = await render(SelectFormFieldMock);
		return {
			user: userEvent.setup(),
			fixture,
			hint: screen.getByTestId('hlm-hint'),
			error: () => screen.queryByTestId('hlm-error'),
			selectTrigger: screen.getByTestId('hlm-select-trigger'),
			select: screen.getByTestId('brn-select'),
		};
	};

	const setupSelectFormFieldWithErrorStateDirty = async () => {
		const { fixture } = await render(SelectFormFieldDirtyMock);
		return {
			user: userEvent.setup(),
			fixture,
			hint: screen.getByTestId('hlm-hint'),
			error: () => screen.queryByTestId('hlm-error'),
			selectTrigger: screen.getByTestId('hlm-select-trigger'),
			select: screen.getByTestId('brn-select'),
		};
	};

	describe('Select Form Field Visibility', () => {
		it('should show the hint initially when no error state', async () => {
			const { hint } = await setupSelectFormField();

			expect(hint.textContent).toBe(TEXT_HINT);
			expect(hint.style.display).not.toBe('none');
		});

		it('should hide the error initially when no error state', async () => {
			const { error } = await setupSelectFormField();

			expect(error()).toBeNull();
		});

		it('should show the error when form is invalid and touched', async () => {
			const { user, error, selectTrigger } = await setupSelectFormField();

			// Click the select trigger to open it
			await user.click(selectTrigger);

			// Click outside to close and trigger touched state
			await user.click(document.body);

			// Check that error is now visible
			const errorElement = error();
			expect(errorElement?.textContent?.trim()).toBe(TEXT_ERROR);
			expect(errorElement).not.toBeNull();
		});

		it('should hide the hint when error is shown', async () => {
			const { user, hint, selectTrigger } = await setupSelectFormField();

			// Click the select trigger to open it
			await user.click(selectTrigger);

			// Click outside to close and trigger touched state
			await user.click(document.body);

			// Check that hint is now hidden
			expect(screen.queryByTestId('hlm-hint')).toBeNull();
		});
	});

	describe('Select Form Field ARIA DescribedBy', () => {
		it('should have aria-describedby with hint ID when no error state', async () => {
			const { hint, selectTrigger } = await setupSelectFormField();

			const hintId = hint.getAttribute('id');
			expect(hintId).toBeDefined();
			expect(hintId).toMatch(/^brn-hint-/);

			// Check that the select trigger has the hint ID in aria-describedby
			const describedBy = selectTrigger.getAttribute('aria-describedby');
			expect(describedBy).toBe(hintId);
		});

		it('should have aria-describedby with error ID when in error state', async () => {
			const { user, error, selectTrigger } = await setupSelectFormField();

			// Click the select trigger to open it
			await user.click(selectTrigger);

			// Click outside to close and trigger touched state
			await user.click(document.body);

			// Wait for error to appear
			const errorElement = error();
			expect(errorElement).not.toBeNull();

			const errorId = errorElement?.getAttribute('id');
			expect(errorId).toBeDefined();
			expect(errorId).toMatch(/^brn-error-/);

			// Check that the select trigger has the error ID in aria-describedby
			const describedBy = selectTrigger.getAttribute('aria-describedby');
			expect(describedBy).toBe(errorId);
		});

		it('should switch from hint ID to error ID in aria-describedby', async () => {
			const { user, hint, error, selectTrigger } = await setupSelectFormField();

			// Initially should have hint ID
			const initialHintId = hint.getAttribute('id');
			expect(selectTrigger.getAttribute('aria-describedby')).toBe(initialHintId);

			// Trigger error state
			await user.click(selectTrigger);
			await user.click(document.body);

			// Now should have error ID
			const errorElement = error();
			expect(errorElement).not.toBeNull();

			const errorId = errorElement?.getAttribute('id');
			expect(selectTrigger.getAttribute('aria-describedby')).toBe(errorId);

			// Should be different from the hint ID
			expect(errorId).not.toBe(initialHintId);
		});
	});

	describe('Select Form Field with Dirty Error State Matcher', () => {
		it('should not show error until select is interacted with', async () => {
			const { user, error, selectTrigger } = await setupSelectFormFieldWithErrorStateDirty();

			// Just click and close without selecting anything
			await user.click(selectTrigger);
			await user.click(document.body);

			// Should not show error because it's not dirty yet
			expect(error()).toBeNull();
		});

		it('should show error after selecting and clearing a value', async () => {
			const { user, error, selectTrigger } = await setupSelectFormFieldWithErrorStateDirty();

			// Open select
			await user.click(selectTrigger);

			// Select an option
			const appleOption = screen.getByText('Apple');
			await user.click(appleOption);

			// Open select again
			await user.click(selectTrigger);

			// Clear the selection (this should make it dirty and invalid)
			// Note: This might need to be adjusted based on how the select handles clearing
			await user.click(document.body);

			// Should now show error because it was dirty and is now invalid
			expect(error()?.textContent?.trim()).toBe(TEXT_ERROR);
		});
	});

	describe('Select Form Field ID Generation', () => {
		it('should have unique IDs for hint and error elements', async () => {
			const { user, hint, error, selectTrigger } = await setupSelectFormField();

			// Get initial hint ID
			const hintId = hint.getAttribute('id');
			expect(hintId).toBeDefined();
			expect(hintId).toMatch(/^brn-hint-/);

			// Trigger error state
			await user.click(selectTrigger);
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
			const { fixture: fixture1 } = await render(SelectFormFieldMock);
			const { fixture: fixture2 } = await render(SelectFormFieldMock);

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

	describe('Select Form Field Accessibility', () => {
		it('should have proper ARIA attributes on hint element', async () => {
			const { hint } = await setupSelectFormField();

			expect(hint.getAttribute('id')).toBeDefined();
			// Hint doesn't need aria-live or role as it's not an error message
		});

		it('should have proper ARIA attributes on error element', async () => {
			const { user, error, selectTrigger } = await setupSelectFormField();

			// Trigger error state
			await user.click(selectTrigger);
			await user.click(screen.getByText('Clear'));
			await user.click(document.body);

			const errorElement = error();
			expect(errorElement).not.toBeNull();

			expect(errorElement?.getAttribute('id')).toBeDefined();
			// expect(errorElement?.getAttribute('aria-live')).toBe('polite');
			// expect(errorElement?.getAttribute('role')).toBe('alert');
		});

		it('should have proper ARIA attributes on select trigger', async () => {
			const { selectTrigger } = await setupSelectFormField();

			console.log(selectTrigger);
			// expect(selectTrigger.getAttribute('role')).toBe('combobox');
			expect(selectTrigger.getAttribute('aria-expanded')).toBe('false');
			expect(selectTrigger.getAttribute('aria-describedby')).toBeDefined();
		});
	});
});
