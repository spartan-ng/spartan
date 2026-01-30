import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { Validators } from 'ng-signal-forms';

type Assignee = {
	id: string;
	name: string;
};

@Component({
	selector: 'spartan-combobox-item-to-string-preview',
	imports: [HlmComboboxImports, BrnPopoverContent, ReactiveFormsModule, HlmButton, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<div hlmFieldGroup>
				<div hlmField>
					<label hlmFieldLabel>Assign reviewer</label>
					<hlm-combobox [(search)]="search" formControlName="assignee" [itemToString]="itemToString">
						<hlm-combobox-input placeholder="e.g. Einstein" />
						<div *brnPopoverContent hlmComboboxContent>
							<hlm-combobox-empty>No items found.</hlm-combobox-empty>
							<div hlmComboboxList>
								@for (assignee of filteredOptions(); track $index) {
									<hlm-combobox-item [value]="assignee.id">{{ assignee.name }}</hlm-combobox-item>
								}
							</div>
						</div>
					</hlm-combobox>
				</div>
				<div hlmField orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				</div>
			</div>
		</form>
	`,
})
export class ComboboxItemToStringPreview {
	private readonly _formBuilder = inject(FormBuilder);

	public search = signal('');

	public form = this._formBuilder.group({
		assignee: new FormControl<string>('8', Validators.required),
	});

	public itemToString = (assigneeId: string) =>
		this._assignees.find((assignee) => assignee.id === assigneeId)?.name ?? '';

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

	public readonly filteredOptions = computed(() => {
		return this._assignees.filter((assignee) => assignee.name.toLowerCase().includes(this.search().toLowerCase()));
	});

	submit() {
		console.log(this.form.value);
	}
}
