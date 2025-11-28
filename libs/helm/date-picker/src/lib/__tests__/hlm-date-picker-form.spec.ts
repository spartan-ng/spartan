import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmDatePicker } from '../../index';

@Component({
	selector: 'hlm-date-picker-host',
	imports: [ReactiveFormsModule, HlmFieldImports, HlmDatePicker],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField>
				<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
				<label hlmFieldLabel>Date *</label>
				<hlm-date-picker formControlName="date"></hlm-date-picker>
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
		const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('hlm-date-picker button');

		expect(host.form.invalid).toBe(true);
		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = button?.getAttribute('aria-describedby') ?? '';
		expect(describedBy.split(' ')).toContain(description!.id);
		expect(describedBy.split(' ')).toContain(error!.id);
	});
});
