import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmCheckbox } from '../../index';

@Component({
	selector: 'hlm-checkbox-host',
	imports: [ReactiveFormsModule, HlmFieldImports, HlmCheckbox],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField>
				<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
				<label hlmFieldLabel>Accept terms *</label>
				<hlm-checkbox formControlName="agreement" aria-describedby="agreement-hint"></hlm-checkbox>
				<p hlmFieldDescription>You must agree to proceed.</p>
				<hlm-field-error>Agree to continue.</hlm-field-error>
			</div>
			<p id="agreement-hint">Review the agreement first.</p>
		</form>
	`,
})
class HlmCheckboxHost {
	public readonly form = new FormGroup({
		agreement: new FormControl(false, { validators: [Validators.requiredTrue] }),
	});
}

describe('HlmCheckbox form integration', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HlmCheckboxHost],
		});
		fixture = TestBed.createComponent(HlmCheckboxHost);
		fixture.detectChanges();
	});

	it('merges consumer and Field descriptions on the checkbox button', () => {
		const host = fixture.componentInstance as HlmCheckboxHost;

		const description: HTMLElement | null = fixture.nativeElement.querySelector('[data-slot="field-description"]');
		const error: HTMLElement | null = fixture.nativeElement.querySelector('[data-slot="field-error"]');
		const checkbox = fixture.nativeElement.querySelector('button[role="checkbox"]');

		expect(host.form.invalid).toBeTruthy();
		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		expect(checkbox).toHaveAttribute('aria-describedby', `agreement-hint ${description!.id}`);
		expect(checkbox.closest('hlm-checkbox')).not.toHaveAttribute('aria-describedby');

		host.form.markAllAsTouched();
		host.form.get('agreement')?.updateValueAndValidity();
		fixture.detectChanges();
		expect(checkbox).toHaveAttribute('aria-describedby', `agreement-hint ${description!.id} ${error!.id}`);
	});
});
