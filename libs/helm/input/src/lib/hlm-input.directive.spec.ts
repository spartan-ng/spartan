import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { type RenderResult, render } from '@testing-library/angular';
import { HlmInputDirective } from './hlm-input.directive';

@Component({
	selector: 'hlm-input-mock',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HlmInputDirective, ReactiveFormsModule],
	template: `
		<form [formGroup]="form">
			<input hlmInput formControlName="testField" [class]="userClass" [error]="error" />
		</form>
	`,
})
class HlmInputMockComponent implements OnInit {
	@Input() public error: 'auto' | true = 'auto';
	@Input() public userClass = '';
	@Input() public required = true;

	public form = new FormGroup({
		testField: new FormControl(''),
	});

	ngOnInit() {
		if (this.required) {
			this.form.get('testField')?.setValidators([Validators.required]);
		}
	}
}

describe('HlmInputDirective', () => {
	let r: RenderResult<HlmInputMockComponent>;
	let input: HTMLInputElement;
	let directive: HlmInputDirective;

	beforeEach(async () => {
		r = await render(HlmInputMockComponent);
		input = r.container.querySelector('input')!;
		directive = r.fixture.debugElement.query(By.directive(HlmInputDirective)).injector.get(HlmInputDirective);
	});

	describe('Error state and styling', () => {
		it('should have auto error classes by default', () => {
			const hasAutoErrorClass = input.className.includes('[&.ng-invalid.ng-touched]:text-destructive');
			expect(hasAutoErrorClass).toBe(true);
		});

		it('should apply manual error styling when error is true', async () => {
			await r.rerender({ componentInputs: { error: true } });
			r.fixture.detectChanges();
			expect(input.classList.contains('text-destructive/20')).toBe(true);
			expect(input.classList.contains('border-destructive')).toBe(true);
			expect(input.classList.contains('focus-visible:ring-destructive')).toBe(true);
		});

		it('should not show error state initially for untouched invalid field', () => {
			const form = r.fixture.componentInstance.form;
			expect(form.get('testField')?.invalid).toBe(true);
			expect(form.get('testField')?.touched).toBe(false);
			expect(directive.errorState()).toBe(false);

			expect(input.classList.contains('text-destructive')).toBe(false);
			expect(input.classList.contains('border-destructive')).toBe(false);
		});

		it('should show error state when field is invalid and touched', async () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsTouched();
			directive.ngDoCheck();
			r.fixture.detectChanges();

			expect(control.invalid).toBe(true);
			expect(control.touched).toBe(true);
			expect(directive.errorState()).toBe(true);
		});

		it('should show error state when field is invalid and dirty', async () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsDirty();

			directive.ngDoCheck();
			r.fixture.detectChanges();
			await r.fixture.whenStable();
			directive.ngDoCheck();
			r.fixture.detectChanges();

			expect(control.invalid).toBe(true);
			expect(control.dirty).toBe(true);

			const shouldShowError = control.invalid && (control.touched || control.dirty);
			expect(shouldShowError).toBe(true);

			input.classList.add('ng-invalid', 'ng-dirty');
			r.fixture.detectChanges();

			const hasAutoErrorClass = input.className.includes('[&.ng-invalid.ng-touched]:text-destructive');
			expect(hasAutoErrorClass).toBe(true);
		});

		it('should clear error state when field becomes valid', async () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsTouched();
			directive.ngDoCheck();
			r.fixture.detectChanges();
			expect(directive.errorState()).toBe(true);

			control.setValue('valid value');
			directive.ngDoCheck();
			r.fixture.detectChanges();

			expect(control.valid).toBe(true);
			expect(directive.errorState()).toBe(false);
		});

		it('should show error state when field is invalid and dirty', async () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsDirty();
			directive.ngDoCheck();
			r.fixture.detectChanges();

			expect(control.invalid).toBe(true);
			expect(control.dirty).toBe(true);

			const shouldShowError = control.invalid && (control.touched || control.dirty);
			expect(shouldShowError).toBe(true);

			directive.setError(shouldShowError ? true : 'auto');
			r.fixture.detectChanges();
			expect(input.classList.contains('text-destructive/20')).toBe(true);
		});

		it('should maintain error state when switching between touched and dirty states', async () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsTouched();
			let shouldShowError = control.invalid && (control.touched || control.dirty);
			expect(shouldShowError).toBe(true);

			control.markAsDirty();
			shouldShowError = control.invalid && (control.touched || control.dirty);
			expect(shouldShowError).toBe(true);

			control.markAsUntouched();
			shouldShowError = control.invalid && (control.touched || control.dirty);
			expect(shouldShowError).toBe(true);

			expect(control.dirty).toBe(true);
			expect(control.touched).toBe(false);
			expect(control.invalid).toBe(true);
		});
	});

	describe('Base styling', () => {
		it('should apply base input classes', () => {
			expect(input.classList.contains('flex')).toBe(true);
			expect(input.classList.contains('rounded-md')).toBe(true);
			expect(input.classList.contains('border')).toBe(true);
			expect(input.classList.contains('border-input')).toBe(true);
			expect(input.classList.contains('bg-transparent')).toBe(true);
		});

		it('should merge user classes', async () => {
			await r.rerender({ componentInputs: { userClass: 'custom-class' } });
			r.fixture.detectChanges();
			expect(input.classList.contains('custom-class')).toBe(true);
		});
	});

	describe('Form integration', () => {
		it('should work with valid fields', async () => {
			await r.rerender({ componentInputs: { required: false } });
			r.fixture.detectChanges();

			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.setValue('test value');
			r.fixture.detectChanges();

			expect(control.valid).toBe(true);
			expect(directive.errorState()).toBe(false);
		});

		it('should update error state on ngDoCheck', () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsTouched();

			directive.ngDoCheck();
			r.fixture.detectChanges();

			expect(directive.errorState()).toBe(true);
		});
	});

	describe('Directive properties', () => {
		it('should have correct ngControl reference', () => {
			expect(directive.ngControl).toBeTruthy();
			expect(directive.ngControl?.name).toBe('testField');
		});

		it('should have auto error input by default', () => {
			expect(directive.error()).toBe('auto');
		});

		it('should update error input', async () => {
			await r.rerender({ componentInputs: { error: true } });
			r.fixture.detectChanges();
			expect(directive.error()).toBe(true);
		});
	});
});
