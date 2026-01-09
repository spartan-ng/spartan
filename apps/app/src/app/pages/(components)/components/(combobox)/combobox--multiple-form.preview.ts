import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

@Component({
	selector: 'spartan-combobox-multiple-form-preview',
	imports: [HlmComboboxImports, BrnPopoverContent, ReactiveFormsModule, HlmButton],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form" [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<hlm-combobox-multiple formControlName="framework">
				<hlm-combobox-chips class="max-w-xs">
					<ng-template hlmComboboxValues let-values>
						@for (value of values; track $index) {
							<hlm-combobox-chip [value]="value">{{ value }}</hlm-combobox-chip>
						}
					</ng-template>

					<input hlmComboboxChipInput />
				</hlm-combobox-chips>
				<div *brnPopoverContent hlmComboboxContent>
					<hlm-combobox-empty>No items found.</hlm-combobox-empty>
					<div hlmComboboxList>
						@for (framework of frameworks; track $index) {
							<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
						}
					</div>
				</div>
			</hlm-combobox-multiple>

			<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
		</form>
	`,
})
export class ComboboxMultipleFormPreview {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		framework: new FormControl<string[] | null>(['Analog']),
	});

	public frameworks = ['Analog', 'Angular', 'Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

	submit() {
		console.log(this.form.value);
	}
}
