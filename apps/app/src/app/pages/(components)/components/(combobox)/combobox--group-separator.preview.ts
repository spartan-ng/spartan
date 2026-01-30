import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

@Component({
	selector: 'spartan-combobox-group-separator-preview',
	imports: [HlmComboboxImports, BrnPopoverContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-combobox>
			<hlm-combobox-input placeholder="Select a timezone" />
			<div *brnPopoverContent hlmComboboxContent>
				<hlm-combobox-empty>No items found.</hlm-combobox-empty>
				<div hlmComboboxList>
					@for (timezoneGroup of timezones; track $index) {
						<div hlmComboboxGroup>
							<div hlmComboboxLabel>{{ timezoneGroup.value }}</div>
							@for (timezone of timezoneGroup.items; track $index) {
								<hlm-combobox-item [value]="timezone">{{ timezone }}</hlm-combobox-item>
							}
							<div hlmComboboxSeparator></div>
						</div>
					}
				</div>
			</div>
		</hlm-combobox>
	`,
})
export class ComboboxGroupSeparatorPreview {
	public timezones = [
		{
			value: 'Americas',
			items: [
				'(GMT-5) New York',
				'(GMT-8) Los Angeles',
				'(GMT-6) Chicago',
				'(GMT-5) Toronto',
				'(GMT-8) Vancouver',
				'(GMT-3) São Paulo',
			],
		},
		{
			value: 'Europe',
			items: [
				'(GMT+0) London',
				'(GMT+1) Paris',
				'(GMT+1) Berlin',
				'(GMT+1) Rome',
				'(GMT+1) Madrid',
				'(GMT+1) Amsterdam',
			],
		},
		{
			value: 'Asia/Pacific',
			items: [
				'(GMT+9) Tokyo',
				'(GMT+8) Shanghai',
				'(GMT+8) Singapore',
				'(GMT+4) Dubai',
				'(GMT+11) Sydney',
				'(GMT+9) Seoul',
			],
		},
	];
}
