import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';

type Assignee = {
	id: string;
	name: string;
};

@Component({
	selector: 'spartan-autocomplete-resolve-value-id',
	imports: [HlmAutocompleteImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<hlm-autocomplete [(search)]="search" [itemToString]="itemToString">
			<hlm-autocomplete-input placeholder="Search reviewers" />
			<hlm-autocomplete-content *hlmAutocompletePortal>
				<hlm-autocomplete-empty>No reviewer found.</hlm-autocomplete-empty>
				<div hlmAutocompleteList>
					@for (option of filteredOptions(); track $index) {
						<hlm-autocomplete-item [value]="option.id">{{ option.name }}</hlm-autocomplete-item>
					}
				</div>
			</hlm-autocomplete-content>
		</hlm-autocomplete>
	`,
})
export class AutocompleteResolveValueIdPreview {
	private readonly _formBuilder = inject(FormBuilder);

	private readonly _assignees: Assignee[] = [
		{ id: '1', name: 'Marty McFly' },
		{ id: '2', name: 'Doc Brown' },
		{ id: '3', name: 'Biff Tannen' },
		{ id: '4', name: 'George McFly' },
		{ id: '5', name: 'Jennifer Parker' },
		{ id: '6', name: 'Emmett Brown' },
		{ id: '7', name: 'Einstein' },
		{ id: '8', name: 'Clara Clayton' },
		{ id: '9', name: 'Needles' },
		{ id: '10', name: 'Goldie Wilson' },
		{ id: '11', name: 'Marvin Berry' },
		{ id: '12', name: 'Lorraine Baines' },
		{ id: '13', name: 'Strickland' },
	];

	public form = this._formBuilder.group({
		assignee: new FormControl<string>('8', Validators.required),
	});

	public readonly search = signal<string>('');

	public itemToString = (assigneeId: string) =>
		this._assignees.find((assignee) => assignee.id === assigneeId)?.name ?? '';

	public readonly filteredOptions = computed(() => {
		return this._assignees.filter((assignee) => assignee.name.toLowerCase().includes(this.search().toLowerCase()));
	});

	submit() {
		console.log(this.form.value);
	}
}
