import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmComboboxImports } from '../../index';

type Framework = { label: string; value: string };

const frameworks: Framework[] = [
	{ label: 'AnalogJs', value: 'analogjs' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'Vue', value: 'vue' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'React', value: 'react' },
	{ label: 'NextJs', value: 'nextjs' },
];

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'combobox-field-test',
	imports: [ReactiveFormsModule, HlmFieldImports, HlmButtonImports, HlmComboboxImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField [attr.data-invalid]="showError ? 'true' : null">
				<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
				<label hlmFieldLabel>Framework *</label>
				<hlm-combobox formControlName="framework">
					<hlm-combobox-input placeholder="Select a framework..." />
					<hlm-combobox-content *hlmComboboxPortal>
						<hlm-combobox-empty>No items found.</hlm-combobox-empty>
						<div hlmComboboxList>
							@for (framework of frameworks; track $index) {
								<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
							}
						</div>
					</hlm-combobox-content>
				</hlm-combobox>
				<p hlmFieldDescription>Pick the framework you rely on most.</p>
				<hlm-field-error>Choose a framework to continue.</hlm-field-error>
			</div>
		</form>
	`,
})
class ComboboxFieldTest {
	public readonly form = new FormGroup({
		framework: new FormControl(null, { validators: [Validators.required] }),
	});

	public readonly frameworks = frameworks;
}

describe('Combobox hint/error wiring', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ComboboxFieldTest],
		});
		fixture = TestBed.createComponent(ComboboxFieldTest);
		const component = fixture.componentInstance as ComboboxFieldTest;
		component.form.markAsTouched();
		component.form.get('framework')?.updateValueAndValidity();
		fixture.detectChanges();
	});

	it('renders description/error ids on the input', () => {
		const description = fixture.nativeElement.querySelector('[data-slot="field-description"]');
		const error = fixture.nativeElement.querySelector('[data-slot="field-error"]');
		const input = fixture.nativeElement.querySelector('input[type="text"]');

		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = input.getAttribute('aria-describedby') ?? '';
		expect(describedBy.split(' ')).toContain(description!.id);
		// TODO should the error id be included in aria-describedby when the field is invalid? If so, we need to add it to the hlm-combobox component.
		// expect(describedBy.split(' ')).toContain(error!.id);
	});

	it('sets aria-invalid on the input when form is invalid and touched', () => {
		const host = fixture.componentInstance as ComboboxFieldTest;

		const control = host.form.get('framework')!;

		control.markAsTouched();
		fixture.detectChanges();

		const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="text"]');

		expect(input.getAttribute('aria-invalid')).toBe('true');
		expect(input.getAttribute('data-touched')).toBe('true');
	});
});
