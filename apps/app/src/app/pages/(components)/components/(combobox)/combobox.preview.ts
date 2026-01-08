import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

@Component({
	selector: 'spartan-combobox-preview',
	imports: [HlmComboboxImports, BrnPopoverContent],
	providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
	template: `
		<hlm-combobox>
			<hlm-combobox-input placeholder="Select a framework" showClear></hlm-combobox-input>
			<div *brnPopoverContent hlmComboboxContent>
				<hlm-combobox-empty>No items found.</hlm-combobox-empty>
				<div hlmComboboxList>
					@for (framework of frameworks; track $index) {
						<hlm-combobox-item [value]="framework">{{ framework.label }}</hlm-combobox-item>
					}
				</div>
			</div>
		</hlm-combobox>
	`,
})
export class ComboboxPreview {
	public frameworks = [
		{
			label: 'AnalogJs',
			value: 'analogjs',
		},
		{
			label: 'Angular',
			value: 'angular',
		},
		{
			label: 'Vue',
			value: 'vue',
		},
		{
			label: 'Nuxt',
			value: 'nuxt',
		},
		{
			label: 'React',
			value: 'react',
		},
		{
			label: 'NextJs',
			value: 'nextjs',
		},
	];
}

export const defaultImports = `
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
`;

export const defaultSkeleton = `
<hlm-combobox>
  <hlm-combobox-input placeholder="Select a framework" showClear></hlm-combobox-input>
  <div *brnPopoverContent hlmComboboxContent>
    <hlm-combobox-empty>No items found.</hlm-combobox-empty>
    <div hlmComboboxList>
      @for (framework of frameworks; track $index) {
      	<hlm-combobox-item [value]="framework">{{ framework.label }}</hlm-combobox-item>
      }
    </div>
  </div>
</hlm-combobox>

`;
