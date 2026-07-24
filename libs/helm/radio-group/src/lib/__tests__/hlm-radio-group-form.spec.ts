import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmRadioGroupImports } from '../../index';

@Component({
	selector: 'hlm-radio-group-host',
	imports: [ReactiveFormsModule, HlmFieldImports, HlmRadioGroupImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField>
				<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
				<label hlmFieldLabel>Plan *</label>
				<hlm-radio-group formControlName="plan" class="text-sm font-medium">
					<hlm-radio value="monthly">
						<hlm-radio-indicator indicator />
					</hlm-radio>
					<hlm-radio value="annual">
						<hlm-radio-indicator indicator />
					</hlm-radio>
				</hlm-radio-group>
				<p hlmFieldDescription>Select a billing plan.</p>

				<hlm-field-error>Choose a plan to continue.</hlm-field-error>
			</div>
		</form>
	`,
})
class HlmRadioGroupHost {
	public readonly form = new FormGroup({
		plan: new FormControl('', { validators: [Validators.required] }),
	});
}

describe('HlmRadioGroup form integration', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HlmRadioGroupHost],
		});
		fixture = TestBed.createComponent(HlmRadioGroupHost);
		fixture.detectChanges();
	});

	it('propagates description/error ids to the radio group', () => {
		const host = fixture.componentInstance as HlmRadioGroupHost;
		host.form.markAllAsTouched();
		host.form.get('plan')?.updateValueAndValidity();
		fixture.detectChanges();

		const description = fixture.nativeElement.querySelector('[data-slot="field-description"]');
		const error = fixture.nativeElement.querySelector('[data-slot="field-error"]');
		const radioGroup = fixture.nativeElement.querySelector('hlm-radio-group');

		expect(host.form.invalid).toBe(true);
		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = radioGroup.getAttribute('aria-describedby') ?? '';
		expect(describedBy.split(' ')).toContain(description!.id);
		expect(describedBy.split(' ')).toContain(error!.id);
	});
});
