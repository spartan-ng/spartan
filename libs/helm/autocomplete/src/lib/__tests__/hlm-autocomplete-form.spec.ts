import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
				<hlm-autocomplete [(search)]="_search">
					<hlm-autocomplete-input placeholder="Search characters" />
					<hlm-autocomplete-content *hlmAutocompletePortal>
						<hlm-autocomplete-empty>No characters found.</hlm-autocomplete-empty>
						<div hlmAutocompleteList>
							@for (option of _filteredOptions(); track $index) {
								<hlm-autocomplete-item [value]="option">{{ option }}</hlm-autocomplete-item>
							}
						</div>
					</hlm-autocomplete-content>
				</hlm-autocomplete>
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

	protected readonly _search = signal('');
	protected readonly _options = [
		'Marty McFly',
		'Doc Brown',
		'Biff Tannen',
		'George McFly',
		'Jennifer Parker',
		'Emmett Brown',
		'Einstein',
		'Clara Clayton',
		'Needles',
		'Goldie Wilson',
		'Marvin Berry',
		'Lorraine Baines',
		'Strickland',
	];
	protected readonly _filteredOptions = computed(() =>
		this._options.filter((option) => option.toLowerCase().includes(this._search().toLowerCase())),
	);
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
