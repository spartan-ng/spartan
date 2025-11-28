import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '../../index';

@Component({
	selector: 'hlm-input-host',
	imports: [ReactiveFormsModule, HlmFieldImports, HlmInput],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField>
				<label hlmFieldLabel for="email">Email *</label>
				<input hlmInput id="email" type="email" formControlName="email" class="w-full" />
				<p hlmFieldDescription>We will email you updates.</p>
				<hlm-field-error>Provide a valid email address.</hlm-field-error>
			</div>
		</form>
	`,
})
class HlmInputHost {
	public readonly form = new FormGroup({
		email: new FormControl('', { validators: [Validators.required, Validators.email] }),
	});
}

describe('HlmInput form integration', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HlmInputHost],
		});
		fixture = TestBed.createComponent(HlmInputHost);
		fixture.detectChanges();
	});

	it('includes description/error ids on the input', () => {
		const host = fixture.componentInstance as HlmInputHost;
		host.form.markAllAsTouched();
		host.form.get('email')?.updateValueAndValidity();
		fixture.detectChanges();

		const description = fixture.nativeElement.querySelector('[data-slot="field-description"]');
		const error = fixture.nativeElement.querySelector('[data-slot="field-error"]');
		const input = fixture.nativeElement.querySelector('input[hlmInput]');

		expect(host.form.invalid).toBeTruthy();
		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = input.getAttribute('aria-describedby') ?? '';
		expect(describedBy.split(' ')).toContain(description!.id);
		expect(describedBy.split(' ')).toContain(error!.id);
	});
});
