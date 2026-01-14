import { Component } from '@angular/core';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

@Component({
	selector: 'spartan-combobox-preview',
	imports: [HlmComboboxImports, BrnPopoverContent],
	template: `
		<hlm-combobox>
			<hlm-combobox-input placeholder="Select a framework"></hlm-combobox-input>
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
  <hlm-combobox-input placeholder="Select a framework"></hlm-combobox-input>
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

export const comboboxDefaultConfig = `
import { comboboxContainsFilter, provideBrnComboboxConfig } from '@spartan-ng/brain/combobox';

provideBrnComboboxConfig({
	filterOptions: {
		usage: 'search',
		sensitivity: 'base',
		ignorePunctuation: true,
	},
	filter: (itemValue: T, search: string, collator: Intl.Collator, itemToString?: ComboboxItemToString<T>) =>
		comboboxContainsFilter(itemValue, search, collator, itemToString),
	isItemEqualToValue: (itemValue: T, selectedValue: T | null) => Object.is(itemValue, selectedValue),
	itemToString: undefined,
});
`;
