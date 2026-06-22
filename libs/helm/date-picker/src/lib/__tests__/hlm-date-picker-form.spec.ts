import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmDatePickerImports } from '../../index';
import { HlmDatePicker } from '../hlm-date-picker';

@Component({
	selector: 'hlm-date-picker-host',
	imports: [ReactiveFormsModule, HlmFieldImports, HlmDatePickerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField>
				<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
				<label hlmFieldLabel>Date *</label>
				<hlm-date-picker captionLayout="dropdown" formControlName="date">
					<hlm-date-picker-trigger>Pick date</hlm-date-picker-trigger>
				</hlm-date-picker>
				<p hlmFieldDescription>Pick a date for the event.</p>
				<hlm-field-error>Select a date to continue.</hlm-field-error>
			</div>
		</form>
	`,
})
class HlmDatePickerHost {
	public readonly form = new FormGroup({
		date: new FormControl<Date | null>(null, { validators: [Validators.required] }),
	});
}

@Component({
	selector: 'hlm-date-picker-dropdown-host',
	imports: [ReactiveFormsModule, HlmDatePickerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<hlm-date-picker captionLayout="dropdown" formControlName="date">
				<hlm-date-picker-trigger buttonId="date">Pick date</hlm-date-picker-trigger>
			</hlm-date-picker>
		</form>
	`,
})
class HlmDatePickerDropdownHost {
	public readonly form = new FormGroup({
		date: new FormControl<Date | null>(null, { validators: [Validators.required] }),
	});
	public readonly datePicker = viewChild.required(HlmDatePicker);
}

describe('HlmDatePicker form integration', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HlmDatePickerHost],
		});
		fixture = TestBed.createComponent(HlmDatePickerHost);
		fixture.detectChanges();
	});

	it('propagates description/error ids to the date picker', () => {
		const host = fixture.componentInstance as HlmDatePickerHost;
		host.form.markAllAsTouched();
		host.form.get('date')?.updateValueAndValidity();
		fixture.detectChanges();

		const description: HTMLElement | null = fixture.nativeElement.querySelector('[data-slot="field-description"]');
		const error: HTMLElement | null = fixture.nativeElement.querySelector('[data-slot="field-error"]');
		const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('hlm-date-picker-trigger button');

		expect(host.form.invalid).toBe(true);
		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = button?.getAttribute('aria-describedby') ?? '';
		expect(describedBy.split(' ')).toContain(description!.id);
		expect(describedBy.split(' ')).toContain(error!.id);
	});

	it('does not mark the calendar month/year selects as invalid when the date picker is invalid', async () => {
		const dropdownFixture = TestBed.createComponent(HlmDatePickerDropdownHost);
		dropdownFixture.detectChanges();
		await dropdownFixture.whenStable();

		const host = dropdownFixture.componentInstance;
		host.form.markAllAsTouched();
		host.form.get('date')?.updateValueAndValidity();
		dropdownFixture.detectChanges();

		const datePicker = host.datePicker();
		datePicker.open();
		dropdownFixture.detectChanges();
		await dropdownFixture.whenStable();

		const trigger: HTMLButtonElement | null = dropdownFixture.nativeElement.querySelector(
			'hlm-date-picker-trigger button',
		);
		expect(trigger?.getAttribute('aria-invalid')).toBe('true');

		const overlay = document.querySelector('.cdk-overlay-container');
		const selectTriggers = overlay ? Array.from(overlay.querySelectorAll('[data-slot="select-trigger"]')) : [];
		expect(selectTriggers.length).toBeGreaterThan(0);
		for (const selectTrigger of selectTriggers) {
			expect(selectTrigger.getAttribute('aria-invalid')).toBeNull();
			expect(selectTrigger.getAttribute('data-matches-spartan-invalid')).toBeNull();
		}
	});

	it('marks the field host as invalid when the trigger is opened then closed', async () => {
		fixture.detectChanges();
		await fixture.whenStable();

		const field: HTMLElement | null = fixture.nativeElement.querySelector('[data-slot="field"]');
		expect(field?.getAttribute('data-matches-spartan-invalid')).toBeNull();

		const trigger: HTMLButtonElement | null = fixture.nativeElement.querySelector('hlm-date-picker-trigger button');
		trigger?.click();
		fixture.detectChanges();
		await fixture.whenStable();

		trigger?.click();
		fixture.detectChanges();
		await fixture.whenStable();

		const host = fixture.componentInstance as HlmDatePickerHost;
		expect(host.form.get('date')?.touched).toBe(true);
		expect(host.form.invalid).toBe(true);

		expect(field?.getAttribute('data-matches-spartan-invalid')).toBe('true');
		expect(field?.getAttribute('data-invalid')).toBe('true');
	});
});
