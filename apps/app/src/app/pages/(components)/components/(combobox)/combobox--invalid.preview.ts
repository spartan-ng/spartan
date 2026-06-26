import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-combobox-invalid-preview',
	imports: [HlmComboboxImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full max-w-xs' },
	template: `
		<hlm-field-group>
			<hlm-field forceInvalid>
				<label hlmFieldLabel>Framework</label>
				<hlm-combobox>
					<hlm-combobox-input forceInvalid placeholder="Select a framework" />
					<hlm-combobox-content *hlmComboboxPortal>
						<hlm-combobox-empty>No items found.</hlm-combobox-empty>
						<div hlmComboboxList>
							@for (framework of frameworks; track $index) {
								<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
							}
						</div>
					</hlm-combobox-content>
				</hlm-combobox>
				<hlm-field-error>Please select a framework.</hlm-field-error>
			</hlm-field>

			<hlm-field forceInvalid>
				<label hlmFieldLabel>Frameworks</label>
				<hlm-combobox-multiple [(value)]="values">
					<hlm-combobox-chips forceInvalid class="max-w-xs">
						<ng-template hlmComboboxValues let-values>
							@for (value of values; track $index) {
								<hlm-combobox-chip [value]="value">{{ value }}</hlm-combobox-chip>
							}
						</ng-template>
						<input hlmComboboxChipInput placeholder="Add frameworks" />
					</hlm-combobox-chips>
					<hlm-combobox-content *hlmComboboxPortal>
						<hlm-combobox-empty>No items found.</hlm-combobox-empty>
						<div hlmComboboxList>
							@for (framework of frameworks; track $index) {
								<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
							}
						</div>
					</hlm-combobox-content>
				</hlm-combobox-multiple>
				<hlm-field-error>Please select at least one framework.</hlm-field-error>
			</hlm-field>

			<hlm-field forceInvalid>
				<label hlmFieldLabel>Frameworks</label>
				<hlm-combobox>
					<hlm-combobox-trigger forceInvalid class="w-full justify-between">
						<hlm-combobox-value placeholder="Select a framework" />
					</hlm-combobox-trigger>
					<hlm-combobox-content *hlmComboboxPortal>
						<hlm-combobox-input showTrigger="false" placeholder="Search" showClear />
						<hlm-combobox-empty>No items found.</hlm-combobox-empty>
						<div hlmComboboxList>
							@for (framework of frameworks; track $index) {
								<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
							}
						</div>
					</hlm-combobox-content>
				</hlm-combobox>
			</hlm-field>
		</hlm-field-group>
	`,
})
export class ComboboxInvalidPreview {
	public values = signal<string[]>(['Angular']);

	public frameworks = ['Analog', 'Angular', 'Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
}
