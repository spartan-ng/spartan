import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmAutocompleteImports } from '../../index';

@Component({
	selector: 'hlm-autocomplete-host',
	imports: [ReactiveFormsModule, HlmFieldImports, HlmAutocompleteImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form">
			<div hlmField>
				<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
				<label hlmFieldLabel>Framework *</label>
				<hlm-autocomplete formControlName="framework" [filteredOptions]="options"></hlm-autocomplete>
				<p hlmFieldDescription>Pick the framework you use most.</p>
				<hlm-field-error>Select a framework.</hlm-field-error>
			</div>
		</form>
	`,
})
class HlmAutocompleteHost {
	public readonly form = new FormGroup({
		framework: new FormControl('', { validators: [Validators.required] }),
	});

	public readonly options = ['Angular', 'React'];
}

describe('HlmAutocomplete form integration', () => {
	let fixture: ReturnType<typeof TestBed.createComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HlmAutocompleteHost],
		});
		fixture = TestBed.createComponent(HlmAutocompleteHost);
		fixture.detectChanges();
	});

	it('adds description and error ids to aria-describedby', () => {
		const host = fixture.componentInstance as HlmAutocompleteHost;
		host.form.markAllAsTouched();
		host.form.get('framework')?.updateValueAndValidity();
		fixture.detectChanges();

		const description: HTMLElement | null = fixture.nativeElement.querySelector('[data-slot="field-description"]');
		const error: HTMLElement | null = fixture.nativeElement.querySelector('[data-slot="field-error"]');
		const input = fixture.nativeElement.querySelector('input[type="text"]');

		expect(host.form.invalid).toBe(true);
		expect(description).toBeTruthy();
		expect(error).toBeTruthy();

		const describedBy = (input as HTMLElement).getAttribute('aria-describedby') ?? '';
		expect(describedBy.split(' ')).toContain(description!.id);
		expect(describedBy.split(' ')).toContain(error!.id);
	});
});
