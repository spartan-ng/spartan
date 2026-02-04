import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';

type Country = {
	name: string;
	code: string;
	flag: string;
};

@Component({
	selector: 'spartan-autocomplete-countries',
	imports: [HlmAutocompleteImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-autocomplete [(search)]="search" [itemToString]="itemToString">
			<hlm-autocomplete-input placeholder="Search countries" />
			<hlm-autocomplete-content *hlmAutocompletePortal>
				<hlm-autocomplete-empty>No countries found.</hlm-autocomplete-empty>
				<div hlmAutocompleteList>
					@for (option of filteredCountries(); track $index) {
						<hlm-autocomplete-item [value]="option">{{ option.flag }} {{ option.name }}</hlm-autocomplete-item>
					}
				</div>
			</hlm-autocomplete-content>
		</hlm-autocomplete>
	`,
})
export class AutocompleteCountriesPreview {
	private readonly _countries: Country[] = [
		{ name: 'Argentina', code: 'AR', flag: '🇦🇷' },
		{ name: 'Australia', code: 'AU', flag: '🇦🇺' },
		{ name: 'Belgium', code: 'BE', flag: '🇧🇪' },
		{ name: 'Brazil', code: 'BR', flag: '🇧🇷' },
		{ name: 'Canada', code: 'CA', flag: '🇨🇦' },
		{ name: 'China', code: 'CN', flag: '🇨🇳' },
		{ name: 'France', code: 'FR', flag: '🇫🇷' },
		{ name: 'Germany', code: 'DE', flag: '🇩🇪' },
		{ name: 'India', code: 'IN', flag: '🇮🇳' },
		{ name: 'Italy', code: 'IT', flag: '🇮🇹' },
		{ name: 'Japan', code: 'JP', flag: '🇯🇵' },
		{ name: 'Mexico', code: 'MX', flag: '🇲🇽' },
		{ name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
		{ name: 'Norway', code: 'NO', flag: '🇳🇴' },
		{ name: 'Russia', code: 'RU', flag: '🇷🇺' },
		{ name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
		{ name: 'South Korea', code: 'KR', flag: '🇰🇷' },
		{ name: 'Spain', code: 'ES', flag: '🇪🇸' },
		{ name: 'Sweden', code: 'SE', flag: '🇸🇪' },
		{ name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
		{ name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
		{ name: 'United States', code: 'US', flag: '🇺🇸' },
	];

	public readonly search = signal<string>('');

	public readonly itemToString = (item: Country): string => {
		return `${item.flag} ${item.name}`;
	};

	public readonly filteredCountries = computed(() =>
		this._countries.filter(
			(country) =>
				country.name.toLowerCase().includes(this.search().toLowerCase()) ||
				`${country.flag} ${country.name}`.toLowerCase().includes(this.search().toLowerCase()),
		),
	);
}
