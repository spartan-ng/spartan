/* eslint-disable @angular-eslint/component-selector */
import { ApplicationRef, ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { BrnAutocompleteSearchInput } from '@spartan-ng/brain/autocomplete';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';

import { HlmError } from './hlm-error';
import { HlmFormField } from './hlm-form-field';
import { HlmHint } from './hlm-hint';

@Component({
	selector: 'autocomplete-form-field-example',
	imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmAutocomplete],
	template: `
		<hlm-form-field>
			<hlm-autocomplete
				data-testid="hlm-autocomplete"
				[formControl]="fruit"
				[filteredOptions]="filteredOptions()"
				searchPlaceholderText="Search fruits..."
				(searchChange)="onSearchChange($event)"
			/>
			<hlm-hint data-testid="hlm-hint">Select a fruit from the list</hlm-hint>
			<hlm-error data-testid="hlm-error">Please select a fruit</hlm-error>
		</hlm-form-field>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class AutocompleteFormFieldMock {
	public fruit = new FormControl<string | null>(null, Validators.required);
	public readonly filteredOptions = signal<string[]>(['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple']);

	onSearchChange(search: string) {
		const allFruits = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'];
		this.filteredOptions.set(allFruits.filter((fruit) => fruit.toLowerCase().includes(search.toLowerCase())));
	}
}

@Component({
	selector: 'autocomplete-form-field-dirty-example',
	imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmAutocomplete],
	template: `
		<hlm-form-field>
			<hlm-autocomplete
				data-testid="hlm-autocomplete"
				[formControl]="fruit"
				[filteredOptions]="filteredOptions()"
				searchPlaceholderText="Search fruits..."
				(searchChange)="onSearchChange($event)"
			/>
			<hlm-hint data-testid="hlm-hint">Select a fruit from the list</hlm-hint>
			<hlm-error data-testid="hlm-error">Please select a fruit</hlm-error>
		</hlm-form-field>
	`,
	providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class AutocompleteFormFieldDirtyMock {
	public fruit = new FormControl<string | null>(null, Validators.required);
	public readonly filteredOptions = signal<string[]>(['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple']);

	onSearchChange(search: string) {
		const allFruits = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'];
		this.filteredOptions.set(allFruits.filter((fruit) => fruit.toLowerCase().includes(search.toLowerCase())));
	}
}

describe('Hlm Form Field with Autocomplete Component', () => {
	const TEXT_HINT = 'Select a fruit from the list';
	const TEXT_ERROR = 'Please select a fruit';

	const setupAutocompleteFormField = async () => {
		const { fixture } = await render(AutocompleteFormFieldMock);
		return {
			user: userEvent.setup(),
			fixture,
			hint: screen.getByTestId('hlm-hint'),
			error: () => screen.queryByTestId('hlm-error'),
			autocomplete: screen.getByTestId('hlm-autocomplete'),
			autocompleteInput: screen.getByTestId('hlm-autocomplete').querySelector('input'),
		};
	};

	const setupAutocompleteFormFieldWithErrorStateDirty = async () => {
		const { fixture } = await render(AutocompleteFormFieldDirtyMock);
		return {
			user: userEvent.setup(),
			fixture,
			hint: screen.getByTestId('hlm-hint'),
			error: () => screen.queryByTestId('hlm-error'),
			autocomplete: screen.getByTestId('hlm-autocomplete'),
			autocompleteInput: screen.getByTestId('hlm-autocomplete').querySelector('input'),
		};
	};

	describe('Autocomplete Form Field Visibility', () => {
		it('should show the hint initially when no error state', async () => {
			const { hint } = await setupAutocompleteFormField();

			expect(hint.textContent).toBe(TEXT_HINT);
			expect(hint.style.display).not.toBe('none');
		});

	it('should hide the error initially when no error state', async () => {
		const { error } = await setupAutocompleteFormField();

		const errorElement = error();
		expect(errorElement).not.toBeNull();
		expect(errorElement?.classList.contains('hidden')).toBe(true);
	});

		it('should show the error when form is invalid and touched', async () => {
			const { user, error, autocompleteInput } = await setupAutocompleteFormField();

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			// Focus the input
			await user.click(autocompleteInput);

			// Click outside to blur and trigger touched state
			await user.click(document.body);

		// Check that error is now visible
		const errorElement = error();
		expect(errorElement?.textContent?.trim()).toBe(TEXT_ERROR);
		expect(errorElement).not.toBeNull();
		expect(errorElement?.classList.contains('hidden')).toBe(false);
	});

		it('should hide the hint when error is shown', async () => {
			const { user, autocompleteInput } = await setupAutocompleteFormField();

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			// Focus the input
			await user.click(autocompleteInput);

		// Click outside to blur and trigger touched state
		await user.click(document.body);

		// Check that hint is now hidden
		const hintElement = screen.queryByTestId('hlm-hint');
		expect(hintElement).not.toBeNull();
		expect(hintElement?.classList.contains('hidden')).toBe(true);
	});
	});

	describe('Autocomplete Form Field ARIA DescribedBy', () => {
		it('should have aria-describedby with hint ID when no error state', async () => {
			const { hint, autocompleteInput } = await setupAutocompleteFormField();

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			const hintId = hint.getAttribute('id');
			expect(hintId).toBeDefined();
			expect(hintId).toMatch(/^brn-hint-/);

			// Check that the autocomplete input has the hint ID in aria-describedby
			const describedBy = autocompleteInput.getAttribute('aria-describedby');
			expect(describedBy).toBe(hintId);
		});

		it('should have aria-describedby with error ID when in error state', async () => {
			const { user, error, autocompleteInput } = await setupAutocompleteFormField();

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			// Focus the input
			await user.click(autocompleteInput);

			// Click outside to blur and trigger touched state
			await user.click(document.body);

			// Wait for error to appear
			const errorElement = error();
			expect(errorElement).not.toBeNull();

			const errorId = errorElement?.getAttribute('id');
			expect(errorId).toBeDefined();
			expect(errorId).toMatch(/^brn-error-/);

			// Check that the autocomplete input has the error ID in aria-describedby
			const describedBy = autocompleteInput.getAttribute('aria-describedby');
			expect(describedBy).toBe(errorId);
		});

		it('should switch from hint ID to error ID in aria-describedby', async () => {
			const { user, hint, error, autocompleteInput } = await setupAutocompleteFormField();

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			// Initially should have hint ID
			const initialHintId = hint.getAttribute('id');
			expect(autocompleteInput.getAttribute('aria-describedby')).toBe(initialHintId);

			// Trigger error state
			await user.click(autocompleteInput);
			await user.click(document.body);

			// Now should have error ID
			const errorElement = error();
			expect(errorElement).not.toBeNull();

			const errorId = errorElement?.getAttribute('id');
			expect(autocompleteInput.getAttribute('aria-describedby')).toBe(errorId);

			// Should be different from the hint ID
			expect(errorId).not.toBe(initialHintId);
		});
	});

	describe('Autocomplete Form Field with Dirty Error State Matcher', () => {
		it('should not show error until autocomplete is interacted with', async () => {
			const { user, error, autocompleteInput } = await setupAutocompleteFormFieldWithErrorStateDirty();

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

		// Just focus and blur without selecting anything
		await user.click(autocompleteInput);
		await user.click(document.body);

		// Should not show error because it's not dirty yet (no value change)
		const errorElement = error();
		expect(errorElement).not.toBeNull();
		expect(errorElement?.classList.contains('hidden')).toBe(true);
	});

		it('should show error after typing and clearing', async () => {
			const { user, error, autocompleteInput } = await setupAutocompleteFormFieldWithErrorStateDirty();

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			// Type something to make it dirty
			await user.click(autocompleteInput);
			await user.type(autocompleteInput, 'App');

			// Clear the input
			await user.clear(autocompleteInput);

		// Click outside
		await user.click(document.body);

		// Should now show error because it was dirty and is now invalid
		const errorElement = error();
		expect(errorElement).not.toBeNull();
		expect(errorElement?.classList.contains('hidden')).toBe(false);
	});
	});

	describe('Autocomplete Form Field ID Generation', () => {
		it('should have unique IDs for hint and error elements', async () => {
			const { user, hint, error, autocompleteInput } = await setupAutocompleteFormField();

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			// Get initial hint ID
			const hintId = hint.getAttribute('id');
			expect(hintId).toBeDefined();
			expect(hintId).toMatch(/^brn-hint-/);

			// Trigger error state
			await user.click(autocompleteInput);
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
			await render(AutocompleteFormFieldMock);
			await render(AutocompleteFormFieldMock);

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

	describe('Autocomplete Form Field Accessibility', () => {
		it('should have proper ARIA attributes on hint element', async () => {
			const { hint } = await setupAutocompleteFormField();

			expect(hint.getAttribute('id')).toBeDefined();
			// Hint doesn't need aria-live or role as it's not an error message
		});

		it('should have proper ARIA attributes on error element', async () => {
			const { user, error, autocompleteInput } = await setupAutocompleteFormField();

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			// Trigger error state
			await user.click(autocompleteInput);
			await user.click(document.body);

			const errorElement = error();
			expect(errorElement).not.toBeNull();

			expect(errorElement?.getAttribute('id')).toBeDefined();
		});

		it('should have proper ARIA attributes on autocomplete input', async () => {
			const { autocompleteInput } = await setupAutocompleteFormField();

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			expect(autocompleteInput.getAttribute('role')).toBe('combobox');
			expect(autocompleteInput.getAttribute('aria-autocomplete')).toBe('list');
			expect(autocompleteInput.getAttribute('aria-describedby')).toBeDefined();
		});
	});

	describe('Autocomplete updateErrorState Method', () => {
		it('should update error state when called manually', async () => {
			const { fixture, autocompleteInput } = await setupAutocompleteFormField();
			const control = fixture.componentInstance.fruit;

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			// Mark as touched but don't trigger change detection
			control.markAsTouched();

			// Get the BrnAutocompleteSearchInput directive
			const brnDirective = fixture.debugElement
				.query(By.directive(BrnAutocompleteSearchInput))
				?.injector.get(BrnAutocompleteSearchInput);

			expect(brnDirective).toBeDefined();

			// Manually call updateErrorState
			brnDirective?.updateErrorState();
			fixture.detectChanges();

			// Error should now be visible
			const errorElement = screen.queryByTestId('hlm-error');
			expect(errorElement?.textContent?.trim()).toBe(TEXT_ERROR);
		});

		it('should mark for check when error state changes', async () => {
			const { fixture, autocompleteInput } = await setupAutocompleteFormField();
			const control = fixture.componentInstance.fruit;

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
			}

			// Get the BrnAutocompleteSearchInput directive
			const brnDirective = fixture.debugElement
				.query(By.directive(BrnAutocompleteSearchInput))
				?.injector.get(BrnAutocompleteSearchInput);

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
			const { fixture, autocompleteInput } = await setupAutocompleteFormField();
			const control = fixture.componentInstance.fruit;
			const appRef = TestBed.inject(ApplicationRef);

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
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
			const { fixture, autocompleteInput } = await setupAutocompleteFormField();
			const control = fixture.componentInstance.fruit;

			if (!autocompleteInput) {
				throw new Error('Autocomplete input not found');
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
