import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-scrollable-preview',
	imports: [HlmSelectImports],
	template: `
		<hlm-select [itemToString]="itemToString">
			<hlm-select-trigger class="w-80">
				<hlm-select-value placeholder="Select a time zone" />
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal class="max-h-96">
				@for (timezone of timezones; track $index) {
					<hlm-select-group>
						<hlm-select-label>{{ timezone.group }}</hlm-select-label>
						@for (option of timezone.options; track $index) {
							<hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
						}
					</hlm-select-group>
				}
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectScrollablePreview {
	timezones = [
		{
			group: 'North America',
			options: [
				{ label: 'Eastern Standard Time', value: 'est' },
				{ label: 'Central Standard Time', value: 'cst' },
				{ label: 'Mountain Standard Time', value: 'mst' },
				{ label: 'Pacific Standard Time', value: 'pst' },
				{ label: 'Alaska Standard Time', value: 'akst' },
				{ label: 'Hawaii Standard Time', value: 'hst' },
			],
		},
		{
			group: 'Europe & Africa',
			options: [
				{ label: 'Greenwich Mean Time', value: 'gmt' },
				{ label: 'Central European Time', value: 'cet' },
				{ label: 'Eastern European Time', value: 'eet' },
				{ label: 'Western European Summer Time', value: 'west' },
				{ label: 'Central Africa Time', value: 'cat' },
				{ label: 'East Africa Time', value: 'eat' },
			],
		},
		{
			group: 'Asia',
			options: [
				{ label: 'Moscow Time', value: 'msk' },
				{ label: 'India Standard Time', value: 'ist' },
				{ label: 'China Standard Time', value: 'cst_china' },
				{ label: 'Japan Standard Time', value: 'jst' },
				{ label: 'Korea Standard Time', value: 'kst' },
				{ label: 'Indonesia Central Standard Time', value: 'ist_indonesia' },
			],
		},
		{
			group: 'Australia & Pacific',
			options: [
				{ label: 'Australian Western Standard Time', value: 'awst' },
				{ label: 'Australian Central Standard Time', value: 'acst' },
				{ label: 'Australian Eastern Standard Time', value: 'aest' },
				{ label: 'New Zealand Standard Time', value: 'nzst' },
				{ label: 'Fiji Time', value: 'fjt' },
			],
		},
		{
			group: 'South America',
			options: [
				{ label: 'Argentina Time', value: 'art' },
				{ label: 'Bolivia Time', value: 'bot' },
				{ label: 'Brasilia Time', value: 'brt' },
				{ label: 'Chile Standard Time', value: 'clt' },
			],
		},
	];

	itemToString = (value: string) =>
		this.timezones.flatMap((group) => group.options).find((option) => option.value === value)?.label || '';
}
