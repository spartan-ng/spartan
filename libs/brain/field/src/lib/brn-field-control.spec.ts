import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, viewChild } from '@angular/core';
import {
	type ControlValueAccessor,
	FormControl,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrnInput } from '@spartan-ng/brain/input';
import { BrnLabel } from '@spartan-ng/brain/label';
import { render } from '@testing-library/angular';
import { BrnField } from './brn-field';
import { BrnFieldControl } from './brn-field-control';

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
	public readonly brnFieldControl = viewChild(BrnFieldControl);
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

@Component({
	selector: 'brn-test-label-for',
	imports: [BrnField, BrnLabel, BrnInput, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnField>
			<label brnLabel>Test Label</label>
			<input brnInput [formControl]="ctrl" />
		</div>
	`,
})
class TestLabelForComponent {
	public ctrl = new FormControl('');
}

@Component({
	selector: 'brn-test-label-for-without-control',
	imports: [BrnField, BrnLabel, BrnInput],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnField>
			<label brnLabel>Test Label</label>
			<input brnInput />
		</div>
	`,
})
class TestLabelForWithoutControlComponent {}

@Component({
	selector: 'brn-test-cva-input',
	imports: [BrnField, BrnLabel, BrnInput, FormsModule, ReactiveFormsModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TestCvaInputComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnField>
			<label brnLabel>Test Label</label>
			<input brnInput id="cva-input-id" />
		</div>
	`,
})
class TestCvaInputComponent implements ControlValueAccessor {
	/* eslint-disable @typescript-eslint/no-empty-function */
	writeValue(): void {}
	registerOnChange(): void {}
	registerOnTouched(): void {}
	setDisabledState?(): void {}
	/* eslint-enable @typescript-eslint/no-empty-function */

	public readonly brnFieldControl = viewChild(BrnFieldControl);
}

@Component({
	selector: 'brn-test-cva-host',
	imports: [TestCvaInputComponent, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-test-cva-input [formControl]="ctrl" />
	`,
})
class TestCvaHostComponent {
	public ctrl = new FormControl('');
	public readonly testCvaInputComponent = viewChild(TestCvaInputComponent);
}

@Component({
	selector: 'brn-test-cva-host-without-control',
	imports: [TestCvaInputComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-test-cva-input />
	`,
})
class TestCvaHostWithoutControlComponent {}

describe('BrnFieldControl', () => {
	describe('ngDoCheck - tracker lifecycle', () => {
		it('should create a state tracker when the control becomes available', async () => {
			const { fixture } = await render(TestHostComponent);
			fixture.detectChanges();

			const controlState = fixture.componentInstance.brnFieldControl()?.controlState();
			expect(controlState).toBeTruthy();
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

		it('should create a state tracker for a field control whose host component is a Control Value Accessor', async () => {
			const { fixture } = await render(TestCvaHostComponent);
			fixture.detectChanges();
			await fixture.whenStable();

			const controlState = fixture.componentInstance.testCvaInputComponent()?.brnFieldControl()?.controlState();
			expect(controlState).toBeTruthy();
		});
	});

	describe('BrnLabelable - automatic "for" attribute set', () => {
		it('should render the correct for attribute when the control is bound on the input', async () => {
			const { fixture } = await render(TestLabelForComponent);
			fixture.detectChanges();
			await fixture.whenStable();

			const input = fixture.debugElement.query(By.css('input'));
			const label = fixture.debugElement.query(By.css('label'));
			expect(input.attributes['id']).toBeTruthy();
			expect(label.attributes['for']).toBe(input.attributes['id']);
		});

		it('should render the correct for attribute when control is not bound on the input', async () => {
			const { fixture } = await render(TestLabelForWithoutControlComponent);
			fixture.detectChanges();
			await fixture.whenStable();

			const input = fixture.debugElement.query(By.css('input'));
			const label = fixture.debugElement.query(By.css('label'));
			expect(input.attributes['id']).toBeTruthy();
			expect(label.attributes['for']).toBe(input.attributes['id']);
		});

		it('should render the correct for attribute when wrapped in a ControlValueAccessor host', async () => {
			const { fixture } = await render(TestCvaHostComponent);
			fixture.detectChanges();
			await fixture.whenStable();

			const input = fixture.debugElement.query(By.css('input'));
			const label = fixture.debugElement.query(By.css('label'));
			expect(input.attributes['id']).toBe('cva-input-id');
			expect(label.attributes['for']).toBe('cva-input-id');
		});

		it('should render the correct for attribute when wrapped in a ControlValueAccessor host without an assigned form control', async () => {
			const { fixture } = await render(TestCvaHostWithoutControlComponent);
			fixture.detectChanges();
			await fixture.whenStable();

			const input = fixture.debugElement.query(By.css('input'));
			const label = fixture.debugElement.query(By.css('label'));
			expect(input.attributes['id']).toBe('cva-input-id');
			expect(label.attributes['for']).toBe('cva-input-id');
		});
	});
});
