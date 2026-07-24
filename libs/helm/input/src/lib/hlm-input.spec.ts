import { ChangeDetectionStrategy, Component, input, type OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, type RenderResult } from '@testing-library/angular';
import { HlmInput } from './hlm-input';

@Component({
	selector: 'hlm-input-mock',
	imports: [HlmInput, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<input hlmInput formControlName="testField" [class]="userClass()" />
		</form>
	`,
})
class HlmInputMock implements OnInit {
	public readonly userClass = input('');
	public readonly required = input(true);

	public form = new FormGroup({
		testField: new FormControl(''),
	});

	ngOnInit() {
		if (this.required()) {
			this.form.get('testField')?.setValidators([Validators.required]);
		}
	}
}

describe('HlmInputDirective', () => {
	let r: RenderResult<HlmInputMock>;
	let input: HTMLInputElement;

	beforeEach(async () => {
		r = await render(HlmInputMock);
		input = r.container.querySelector('input')!;
	});

	describe('Error state and styling', () => {
		it('should not show error state initially for untouched invalid field', async () => {
			await r.fixture.whenStable();
			r.fixture.detectChanges();

			const form = r.fixture.componentInstance.form;
			expect(form.get('testField')?.invalid).toBe(true);
			expect(form.get('testField')?.touched).toBe(false);

			expect(input.classList.contains('border-destructive')).toBe(false);
			expect(input.getAttribute('data-invalid')).toBe('true');
			expect(input.getAttribute('data-touched')).toBeNull();
		});

		it('should show error state when field is invalid and touched', async () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsTouched();

			r.fixture.detectChanges();

			expect(control.invalid).toBe(true);
			expect(control.touched).toBe(true);
			expect(input.getAttribute('data-invalid')).toBe('true');
			expect(input.getAttribute('data-touched')).toBe('true');
		});

		it('should show error state when field is invalid and dirty', async () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsDirty();

			r.fixture.detectChanges();
			await r.fixture.whenStable();
			r.fixture.detectChanges();

			expect(control.invalid).toBe(true);
			expect(control.dirty).toBe(true);

			const shouldShowError = control.invalid && (control.touched || control.dirty);
			expect(shouldShowError).toBe(true);
			expect(input.getAttribute('data-invalid')).toBe('true');
			expect(input.getAttribute('data-dirty')).toBe('true');

			input.classList.add('ng-invalid', 'ng-dirty');
			r.fixture.detectChanges();
		});

		it('should clear error state when field becomes valid', async () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsTouched();
			r.fixture.detectChanges();
			expect(input.getAttribute('data-invalid')).toBe('true');

			control.setValue('valid value');

			r.fixture.detectChanges();

			expect(control.valid).toBe(true);
			expect(input.getAttribute('data-invalid')).toBeNull();
		});

		it('should show error state when field is invalid and dirty', async () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsDirty();
			r.fixture.detectChanges();

			expect(control.invalid).toBe(true);
			expect(control.dirty).toBe(true);
			expect(input.getAttribute('data-invalid')).toBe('true');
			expect(input.getAttribute('data-dirty')).toBe('true');

			control.markAsTouched();
			r.fixture.detectChanges();

			expect(input.getAttribute('data-touched')).toBe('true');
			expect(input.getAttribute('data-matches-spartan-invalid')).toBe('true');

			const shouldShowError = control.invalid && (control.touched || control.dirty);
			expect(shouldShowError).toBe(true);
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
			expect(input.getAttribute('data-invalid')).toBeNull();
		});

		it('should update error state on ngDoCheck', () => {
			const form = r.fixture.componentInstance.form;
			const control = form.get('testField')!;

			control.markAsTouched();

			r.fixture.detectChanges();

			expect(input.getAttribute('data-invalid')).toBe('true');
		});
	});
});
