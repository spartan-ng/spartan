import { Component, computed, signal } from '@angular/core';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';

@Component({
	selector: 'spartan-autocomplete-clear-preview',
	imports: [HlmAutocompleteImports, BrnPopoverContent],
	template: `
		<hlm-autocomplete [(search)]="search">
			<hlm-autocomplete-input placeholder="Search characters" showClear />
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
	`,
})
export class AutocompleteClearPreview {
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
}
