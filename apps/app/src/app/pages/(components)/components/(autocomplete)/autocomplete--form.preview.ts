import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-autocomplete-form-preview',
	imports: [HlmAutocompleteImports, BrnPopoverContent, ReactiveFormsModule, HlmButton],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<hlm-autocomplete formControlName="character" [(search)]="search">
				<hlm-autocomplete-input placeholder="Search characters" />
				<div *brnPopoverContent hlmAutocompleteContent>
					<div hlmAutocompleteList>
						<hlm-autocomplete-empty>No characters found.</hlm-autocomplete-empty>
						@for (option of filteredOptions(); track $index) {
							<hlm-autocomplete-item [value]="option">
								{{ option }}
							</hlm-autocomplete-item>
						}
					</div>
				</div>
			</hlm-autocomplete>

			<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
		</form>
	`,
})
export class AutocompleteFormPreview {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		character: new FormControl<string | null>(null),
	});

	private readonly _options: string[] = [
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

	public readonly search = signal('');

	public readonly filteredOptions = computed(() =>
		this._options.filter((option) => option.toLowerCase().includes(this.search().toLowerCase())),
	);

	submit() {
		console.log(this.form.value);
	}
}
