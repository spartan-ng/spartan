import { Component, computed, inject, resource, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmAutocomplete, HlmAutocompleteImports, provideHlmAutocompleteConfig } from '@spartan-ng/helm/autocomplete';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

@Component({
	selector: 'spartan-autocomplete-async',
	imports: [HlmAutocompleteImports, HlmSpinnerImports],
	template: `
		<hlm-autocomplete [filteredOptions]="options.value()" [loading]="options.isLoading()" [(search)]="search">
			<hlm-spinner loading class="size-6" />
		</hlm-autocomplete>
	`,
})
class AutocompleteAsync {
	public readonly search = signal('');

	public options = resource({
		defaultValue: [],
		params: () => ({ search: this.search() }),
		loader: async ({ params }) => {
			const search = params.search;

			if (search.length === 0) {
				return [];
			}

			// Simulate empty state
			if (search === 'empty') {
				return [];
			}

			// DEV - call your API or 3rd party service here
			// simulate async
			return new Promise<string[]>((resolve) => {
				setTimeout(() => {
					const newOptions = Array.from({ length: 15 }, (_, i) => `${search}-${i + 1}`);
					resolve(newOptions);
				}, 500);
			});
		},
	});
}

type Country = {
	name: string;
	code: string;
	flag: string;
};

@Component({
	selector: 'spartan-autocomplete-form',
	imports: [HlmAutocompleteImports, ReactiveFormsModule, HlmButtonImports, HlmLabelImports],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div class="flex flex-col gap-2">
				<label for="autocomplete" hlmLabel class="px-1">Choose your favorite character</label>
				<hlm-autocomplete
					inputId="autocomplete"
					[filteredOptions]="filteredOptions()"
					[(search)]="search"
					formControlName="option"
				/>
			</div>

			<button type="submit" hlmBtn>Submit</button>
		</form>
	`,
})
class AutocompleteForm {
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _options: string[] = [
		'Marty McFly',
		'Doc Brown',
		'Biff Tannen',
		'George McFly',
		'Jennifer Parker',
		'Emmett Brown',
		'Einstein',
		'Clara Clayton',
		'Needles',
		'Goldie Wilson',
		'Marvin Berry',
		'Lorraine Baines',
		'Strickland',
	];

	public readonly search = signal('');

	public form = this._formBuilder.group({
		option: [null, Validators.required],
	});

	public readonly filteredOptions = computed(() =>
		this._options.filter((option) => option.toLowerCase().includes(this.search().toLowerCase())),
	);

	submit() {
		console.log(this.form.value);
	}
}

type Item = {
	id: string;
	label: string;
};

@Component({
	selector: 'spartan-autocomplete-transform-option-value',
	imports: [HlmAutocompleteImports, ReactiveFormsModule, HlmButtonImports, HlmLabelImports],
	providers: [
		provideHlmAutocompleteConfig({
			transformOptionToString: (option: Item) => option.label,
		}),
	],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div class="flex flex-col gap-2">
				<label for="autocomplete" hlmLabel class="px-1">Choose your favorite character</label>
				<hlm-autocomplete
					inputId="autocomplete"
					formControlName="option"
					[transformOptionToValue]="_transformOptionValue"
					[displayWith]="_displayWith"
					[filteredOptions]="filteredOptions()"
					[(search)]="search"
					showClearBtn
				/>
			</div>

			<button type="submit" hlmBtn>Submit</button>
		</form>
	`,
})
class AutocompleteTransformOptionValue {
	private readonly _formBuilder = inject(FormBuilder);
	private readonly _options: Item[] = [
		{ id: '1', label: 'Marty McFly' },
		{ id: '2', label: 'Doc Brown' },
		{ id: '3', label: 'Biff Tannen' },
		{ id: '4', label: 'George McFly' },
		{ id: '5', label: 'Jennifer Parker' },
		{ id: '6', label: 'Emmett Brown' },
		{ id: '7', label: 'Einstein' },
		{ id: '8', label: 'Clara Clayton' },
		{ id: '9', label: 'Needles' },
		{ id: '10', label: 'Goldie Wilson' },
		{ id: '11', label: 'Marvin Berry' },
		{ id: '12', label: 'Lorraine Baines' },
		{ id: '13', label: 'Strickland' },
	];

	protected _transformOptionValue = (option: Item) => option.id;

	protected _displayWith = (id: string) => this._options.find((option) => option.id === id)?.label ?? '';

	public readonly search = signal('');

	public form = this._formBuilder.group({
		option: ['10', Validators.required],
	});

	public readonly filteredOptions = computed(() => {
		return this._options.filter((option) => option.label.toLowerCase().includes(this.search().toLowerCase()));
	});

	submit() {
		console.log(this.form.value.option);
	}
}

export default {
	title: 'Autocomplete',
	component: HlmAutocomplete,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [AutocompleteAsync, AutocompleteForm, AutocompleteTransformOptionValue, HlmAutocompleteImports],
		}),
	],
} as Meta<HlmAutocomplete<unknown>>;

type Story = StoryObj<HlmAutocomplete<unknown>>;

export const Default: Story = {
	render: () => {
		const search = signal('');
		const options = [
			'Marty McFly',
			'Doc Brown',
			'Biff Tannen',
			'George McFly',
			'Jennifer Parker',
			'Emmett Brown',
			'Einstein',
			'Clara Clayton',
			'Needles',
			'Goldie Wilson',
			'Marvin Berry',
			'Lorraine Baines',
			'Strickland',
		];
		const filteredOptions = computed(() =>
			options.filter((option) => option.toLowerCase().includes(search().toLowerCase())),
		);
		return {
			props: {
				search,
				filteredOptions,
			},
			template: `
		<hlm-autocomplete [filteredOptions]="filteredOptions()" [(search)]="search" />
	`,
		};
	},
};

export const Async: Story = {
	render: () => ({
		template: '<spartan-autocomplete-async />',
	}),
};

export const Config: Story = {
	decorators: [
		moduleMetadata({
			providers: [
				provideHlmAutocompleteConfig({
					transformOptionToString: (option: Country) => `${option.flag} ${option.name}`,
					transformValueToSearch: (option: Country) => `${option.flag} ${option.name}`,
				}),
			],
		}),
	],
	render: () => {
		const search = signal('');
		const countries: Country[] = [
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
		const filteredCountries = computed(() =>
			countries.filter(
				(country) =>
					country.name.toLowerCase().includes(search().toLowerCase()) ||
					`${country.flag} ${country.name}`.toLowerCase().includes(search().toLowerCase()),
			),
		);
		return {
			props: {
				search,
				filteredCountries,
			},
			template: `
		<hlm-autocomplete [filteredOptions]="filteredCountries()" [(search)]="search" />
	`,
		};
	},
};

export const Countries: Story = {
	decorators: [
		moduleMetadata({
			providers: [
				provideHlmAutocompleteConfig({
					transformValueToSearch: (option: Country) => `${option.flag} ${option.name}`,
				}),
			],
		}),
	],
	render: () => {
		const search = signal('');
		const countries: Country[] = [
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
		const filteredCountries = computed(() =>
			countries.filter(
				(country) =>
					country.name.toLowerCase().includes(search().toLowerCase()) ||
					`${country.flag} ${country.name}`.toLowerCase().includes(search().toLowerCase()),
			),
		);
		return {
			props: {
				search,
				filteredCountries,
			},
			template: `
		<hlm-autocomplete [filteredOptions]="filteredCountries()" [optionTemplate]="option" [(search)]="search" />

		<!-- custom option template with access to the option item -->
		<ng-template #option let-option>{{ option.flag }} {{ option.name }}</ng-template>
	`,
		};
	},
};

export const Form: Story = {
	render: () => ({
		template: '<spartan-autocomplete-form />',
	}),
};

export const TransformOptionValue: Story = {
	render: () => ({
		template: '<spartan-autocomplete-transform-option-value />',
	}),
};
