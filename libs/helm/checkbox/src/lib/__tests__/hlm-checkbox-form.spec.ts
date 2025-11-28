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
				<hlm-checkbox formControlName="agreement"></hlm-checkbox>
				<p hlmFieldDescription>You must agree to proceed.</p>
				<hlm-field-error>Agree to continue.</hlm-field-error>
			</div>
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

	it('collects hint + error ids on checkbox', () => {
		const host = fixture.componentInstance as HlmCheckboxHost;
		host.form.markAllAsTouched();
		host.form.get('agreement')?.updateValueAndValidity();
		fixture.detectChanges();

		const description: HTMLElement | null = fixture.nativeElement.querySelector('[data-slot="field-description"]');
		const error: HTMLElement | null = fixture.nativeElement.querySelector('[data-slot="field-error"]');
		const checkbox = fixture.nativeElement.querySelector('hlm-checkbox');

		expect(host.form.invalid).toBeTruthy();
		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = checkbox.getAttribute('aria-describedby') ?? '';
		expect(describedBy.split(' ')).toContain(description!.id);
		expect(describedBy.split(' ')).toContain(error!.id);
	});
});
