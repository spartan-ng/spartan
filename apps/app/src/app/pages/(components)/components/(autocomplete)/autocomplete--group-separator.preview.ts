import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-autocomplete-group-separator-preview',
	imports: [HlmAutocompleteImports, HlmPopoverImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-autocomplete [(search)]="search">
			<hlm-autocomplete-input placeholder="Select a timezone" />
			<div *hlmPopoverPortal hlmAutocompleteContent>
				<hlm-autocomplete-empty>No items found.</hlm-autocomplete-empty>
				<div hlmAutocompleteList>
					@for (timezoneGroup of filteredTimezones(); track $index) {
						<div hlmAutocompleteGroup>
							<div hlmAutocompleteLabel>{{ timezoneGroup.value }}</div>
							@for (timezone of timezoneGroup.items; track $index) {
								<hlm-autocomplete-item [value]="timezone">{{ timezone }}</hlm-autocomplete-item>
							}
							<div hlmAutocompleteSeparator></div>
						</div>
					}
				</div>
			</div>
		</hlm-autocomplete>
	`,
})
export class AutocompleteGroupSeparatorPreview {
	private readonly _timezones = [
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

	public readonly search = signal('');

	public readonly filteredTimezones = computed(() => {
		const search = this.search().toLowerCase();
		return this._timezones
			.map((timezoneGroup) => ({
				...timezoneGroup,
				items: timezoneGroup.items.filter((timezone) => timezone.toLowerCase().includes(search)),
			}))
			.filter((timezoneGroup) => timezoneGroup.items.length > 0);
	});
}
