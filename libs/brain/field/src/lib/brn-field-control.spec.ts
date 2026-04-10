import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnInput } from '@spartan-ng/brain/input';
import { render } from '@testing-library/angular';

@Component({
	selector: 'brn-test-host',
	imports: [BrnInput, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input brnInput [formControl]="ctrl" data-testid="input" />
	`,
})
class TestHostComponent {
	public ctrl = new FormControl('initial');
	public readonly brnInput = viewChild(BrnInput);
}

@Component({
	selector: 'brn-test-host-swap',
	imports: [BrnInput, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input brnInput [formControl]="ctrl" data-testid="input" />
	`,
})
class TestHostSwapComponent {
	public ctrl = new FormControl('first');
	public readonly brnInput = viewChild(BrnInput);
	private readonly _cdr = inject(ChangeDetectorRef);

	swap(newCtrl: FormControl) {
		this.ctrl = newCtrl;
		this._cdr.markForCheck();
	}
}

@Component({
	selector: 'brn-test-host-validation',
	imports: [BrnInput, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<input brnInput [formControl]="ctrl" data-testid="input" />
	`,
})
class TestHostValidationComponent {
	public ctrl = new FormControl('', [Validators.required]);
}

describe('BrnFieldControl', () => {
	describe('ngDoCheck - tracker lifecycle', () => {
		it('should create a state tracker when the control becomes available', async () => {
			const { fixture } = await render(TestHostComponent);
			fixture.detectChanges();

			const brnInput = fixture.componentInstance.brnInput();
			expect(brnInput).toBeTruthy();
		});

		it('should expose dirty state from the underlying form control', async () => {
			const { fixture, getByTestId } = await render(TestHostValidationComponent);
			fixture.detectChanges();
			await fixture.whenStable();

			const input = getByTestId('input') as HTMLInputElement;
			expect(input.getAttribute('data-dirty')).toBeNull();

			fixture.componentInstance.ctrl.markAsDirty();
			fixture.componentInstance.ctrl.updateValueAndValidity();
			fixture.detectChanges();
			await fixture.whenStable();

			expect(input.getAttribute('data-dirty')).toBe('true');
		});

		it('should expose touched state from the underlying form control', async () => {
			const { fixture, getByTestId } = await render(TestHostValidationComponent);
			fixture.detectChanges();
			await fixture.whenStable();

			const input = getByTestId('input') as HTMLInputElement;
			expect(input.getAttribute('data-touched')).toBeNull();

			fixture.componentInstance.ctrl.markAsTouched();
			fixture.componentInstance.ctrl.updateValueAndValidity();
			fixture.detectChanges();
			await fixture.whenStable();

			expect(input.getAttribute('data-touched')).toBe('true');
		});

		it('should expose invalid state from the underlying form control', async () => {
			const { fixture, getByTestId } = await render(TestHostValidationComponent);
			fixture.detectChanges();
			await fixture.whenStable();

			const input = getByTestId('input') as HTMLInputElement;

			fixture.componentInstance.ctrl.markAsTouched();
			fixture.componentInstance.ctrl.updateValueAndValidity();
			fixture.detectChanges();
			await fixture.whenStable();

			expect(input.getAttribute('data-invalid')).toBe('true');
		});

		it('should update tracker when formControl binding changes to a new instance', async () => {
			const { fixture, getByTestId } = await render(TestHostSwapComponent);
			fixture.detectChanges();
			await fixture.whenStable();

			const input = getByTestId('input') as HTMLInputElement;

			// Create a new control that is invalid (empty with required validator)
			const newCtrl = new FormControl('', [Validators.required]);
			newCtrl.markAsTouched();
			newCtrl.markAsDirty();

			fixture.componentInstance.swap(newCtrl);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(input.getAttribute('data-dirty')).toBe('true');
			expect(input.getAttribute('data-touched')).toBe('true');
			expect(input.getAttribute('data-invalid')).toBe('true');
		});

		it('should clear invalid state when swapping to a valid control', async () => {
			const { fixture, getByTestId } = await render(TestHostSwapComponent);
			fixture.componentInstance.swap(new FormControl('', [Validators.required]));
			fixture.detectChanges();
			await fixture.whenStable();

			const input = getByTestId('input') as HTMLInputElement;

			fixture.componentInstance.ctrl.markAsTouched();
			fixture.componentInstance.ctrl.updateValueAndValidity();
			fixture.detectChanges();

			expect(input.getAttribute('data-invalid')).toBe('true');

			const validCtrl = new FormControl('valid value');
			fixture.componentInstance.swap(validCtrl);
			fixture.detectChanges();
			await fixture.whenStable();

			expect(input.getAttribute('data-invalid')).toBeNull();
		});
	});
});
