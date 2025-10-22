import { Component, computed, signal } from '@angular/core';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { provideHlmAutocompleteConfig } from 'libs/helm/autocomplete/src/lib/hlm-autocomplete.token';

type Country = {
	name: string;
	code: string;
	flag: string;
};

@Component({
	selector: 'spartan-autocomplete-countries',
	imports: [HlmAutocompleteImports],
	template: `
		<hlm-autocomplete [filteredOptions]="filteredCountries()" [optionTemplate]="option" [(search)]="search" />

		<!-- custom option template with access to the option item -->
		<ng-template #option let-option>{{ option.flag }} {{ option.name }}</ng-template>
	`,
	providers: [
		provideHlmAutocompleteConfig({
			transformValueToSearch: (option: Country) => `${option.flag} ${option.name}`,
		}),
	],
})
export class AutocompleteCountries {
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

	public readonly filteredCountries = computed(() =>
		this._countries.filter(
			(country) =>
				country.name.toLowerCase().includes(this.search().toLowerCase()) ||
				`${country.flag} ${country.name}`.toLowerCase().includes(this.search().toLowerCase()),
		),
	);
}
