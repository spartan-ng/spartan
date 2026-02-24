import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSlider } from '../../index';

@Component({
	selector: 'hlm-slider-host',
	imports: [HlmSlider, ReactiveFormsModule, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField>
				<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
				<label hlmFieldLabel>Volume *</label>
				<hlm-slider formControlName="value"></hlm-slider>
				<p hlmFieldDescription>Set the volume level.</p>
				<hlm-field-error>Adjust the slider before continuing.</hlm-field-error>
			</div>
		</form>
	`,
})
class HlmSliderHost {
	public readonly form = new FormGroup({
		value: new FormControl([0], { validators: [Validators.min(5), Validators.required] }),
	});
}

describe('HlmSlider form integration', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HlmSliderHost],
		});
		fixture = TestBed.createComponent(HlmSliderHost);
		fixture.detectChanges();
	});

	it('marks slider aria-invalid when control invalid', () => {
		const host = fixture.componentInstance as HlmSliderHost;
		host.form.markAllAsTouched();
		host.form.get('value')?.updateValueAndValidity();
		fixture.detectChanges();

		const slider: HTMLElement | null = fixture.nativeElement.querySelector('hlm-slider');

		expect(host.form.invalid).toBe(true);
		expect(slider?.getAttribute('aria-invalid')).toBe('true');
		expect(slider?.getAttribute('data-invalid')).toBe('true');
	});
});
