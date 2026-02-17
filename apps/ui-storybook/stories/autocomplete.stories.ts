import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideBrnAutocompleteConfig } from '@spartan-ng/brain/autocomplete';
import { HlmAutocomplete, HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmButton, HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

@Component({
	selector: 'autocomplete-reactive-form-story',

	imports: [JsonPipe, HlmAutocompleteImports, HlmFieldImports, HlmButton, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form" class="w-full max-w-sm space-y-3">
			<div hlmField>
				<label hlmFieldLabel>Framework *</label>
				<hlm-autocomplete formControlName="framework" [(search)]="search">
					<hlm-autocomplete-input placeholder="Search frameworks..." />
					<hlm-autocomplete-content *hlmAutocompletePortal>
						<hlm-autocomplete-empty>No frameworks found.</hlm-autocomplete-empty>
						<div hlmAutocompleteList>
							@for (fw of filteredOptions(); track fw) {
								<hlm-autocomplete-item [value]="fw">{{ fw }}</hlm-autocomplete-item>
							}
						</div>
					</hlm-autocomplete-content>
				</hlm-autocomplete>
				<p hlmFieldDescription>Start typing to find a framework.</p>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
				<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
			</div>
		</form>

		<pre class="mt-4 text-xs">
Touched: {{ form.get('framework')?.touched }}  |  Invalid: {{ form.get('framework')?.invalid }}  |  Value: {{
				form.get('framework')?.value | json
			}}</pre
		>
	`,
})
class AutocompleteReactiveFormStory {
	private readonly _fb = inject(FormBuilder);
	public readonly form = this._fb.group({ framework: ['', Validators.required] });
	public readonly search = signal('');
	public readonly filteredOptions = computed(() =>
		frameworks.filter((fw) => fw.toLowerCase().includes(this.search().toLowerCase())),
	);
}

// ── With Hint and Error ──────────────────────────────────────────────────────

@Component({
	selector: 'autocomplete-hint-error-story',

	imports: [HlmAutocompleteImports, HlmFieldImports, HlmButton, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@let ctrl = form.get('framework');
		@let showError = ctrl?.invalid && (ctrl?.touched || ctrl?.dirty);

		<form [formGroup]="form" class="w-full max-w-sm space-y-3">
			<div hlmField [attr.data-invalid]="showError ? 'true' : null">
				<label hlmFieldLabel>Framework *</label>
				<hlm-autocomplete formControlName="framework" [(search)]="search">
					<hlm-autocomplete-input placeholder="Search frameworks..." />
					<hlm-autocomplete-content *hlmAutocompletePortal>
						<hlm-autocomplete-empty>No frameworks found.</hlm-autocomplete-empty>
						<div hlmAutocompleteList>
							@for (fw of filteredOptions(); track fw) {
								<hlm-autocomplete-item [value]="fw">{{ fw }}</hlm-autocomplete-item>
							}
						</div>
					</hlm-autocomplete-content>
				</hlm-autocomplete>

				<p hlmFieldDescription>Pick your primary framework so we can tailor docs.</p>

				@if (showError) {
					<hlm-field-error>Select a framework to continue.</hlm-field-error>
				}
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
				<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
			</div>
		</form>
	`,
})
class AutocompleteHintErrorStory {
	private readonly _fb = inject(FormBuilder);
	public readonly form = this._fb.group({ framework: ['', Validators.required] });
	public readonly search = signal('');
	public readonly filteredOptions = computed(() =>
		frameworks.filter((fw) => fw.toLowerCase().includes(this.search().toLowerCase())),
	);
}

@Component({
	selector: 'spartan-autocomplete-async',
	imports: [HlmAutocompleteImports, HlmSpinnerImports],
	template: `
		<hlm-autocomplete [(search)]="search">
			<hlm-autocomplete-input placeholder="Search" />
			<hlm-autocomplete-content *hlmAutocompletePortal>
				<hlm-autocomplete-status class="justify-start">
					@if (options.isLoading()) {
						<hlm-spinner />
					}
				</hlm-autocomplete-status>
				<div hlmAutocompleteList>
					@if (options.hasValue()) {
						@for (option of options.value(); track $index) {
							<hlm-autocomplete-item [value]="option">{{ option }}</hlm-autocomplete-item>
						}
					}
				</div>
			</hlm-autocomplete-content>
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
				<hlm-autocomplete formControlName="option" [(search)]="search">
					<hlm-autocomplete-input placeholder="Search characters" />
					<hlm-autocomplete-content *hlmAutocompletePortal>
						<hlm-autocomplete-empty>No characters found.</hlm-autocomplete-empty>
						<div hlmAutocompleteList>
							@for (option of filteredOptions(); track $index) {
								<hlm-autocomplete-item [value]="option">{{ option }}</hlm-autocomplete-item>
							}
						</div>
					</hlm-autocomplete-content>
				</hlm-autocomplete>
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
		option: new FormControl<string | null>(null, Validators.required),
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
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div class="flex flex-col gap-2">
				<label for="autocomplete" hlmLabel class="px-1">Choose your favorite character</label>
				<hlm-autocomplete formControlName="option" [(search)]="search" [itemToString]="itemToString">
					<hlm-autocomplete-input placeholder="Search characters" showClear />
					<hlm-autocomplete-content *hlmAutocompletePortal>
						<hlm-autocomplete-empty>No characters found.</hlm-autocomplete-empty>
						<div hlmAutocompleteList>
							@for (option of filteredOptions(); track $index) {
								<hlm-autocomplete-item [value]="option.id">{{ option.label }}</hlm-autocomplete-item>
							}
						</div>
					</hlm-autocomplete-content>
				</hlm-autocomplete>
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

	public itemToString = (id: string) => this._options.find((option) => option.id === id)?.label ?? '';

	public readonly search = signal('');

	public form = this._formBuilder.group({
		option: new FormControl<string>('10', Validators.required),
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
			imports: [
				AutocompleteAsync,
				AutocompleteForm,
				AutocompleteTransformOptionValue,
				HlmAutocompleteImports,
				AutocompleteReactiveFormStory,
				AutocompleteHintErrorStory,
			],
		}),
	],
} as Meta<HlmAutocomplete>;

type Story = StoryObj<HlmAutocomplete>;

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
		<hlm-autocomplete [(search)]="search">
			<hlm-autocomplete-input placeholder="Search characters" />
			<hlm-autocomplete-content *hlmAutocompletePortal>
				<hlm-autocomplete-empty>No characters found.</hlm-autocomplete-empty>
				<div hlmAutocompleteList>
					@for (option of filteredOptions(); track $index) {
						<hlm-autocomplete-item [value]="option">{{ option }}</hlm-autocomplete-item>
					}
				</div>
			</hlm-autocomplete-content>
		</hlm-autocomplete>
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
				provideBrnAutocompleteConfig({
					itemToString: (option: Country) => `${option.flag} ${option.name}`,
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
		<hlm-autocomplete [(search)]="search">
			<hlm-autocomplete-input placeholder="Search countries" />
			<hlm-autocomplete-content *hlmAutocompletePortal>
				<hlm-autocomplete-empty>No countries found.</hlm-autocomplete-empty>
				<div hlmAutocompleteList>
					@for (country of filteredCountries(); track $index) {
						<hlm-autocomplete-item [value]="country">{{ country.flag }} {{ country.name }}</hlm-autocomplete-item>
					}
				</div>
			</hlm-autocomplete-content>
		</hlm-autocomplete>
	`,
		};
	},
};

export const Countries: Story = {
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
		const itemToString = (country: Country) => `${country.flag} ${country.name}`;
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
				itemToString,
			},
			template: `
		<hlm-autocomplete [(search)]="search" [itemToString]="itemToString">
			<hlm-autocomplete-input placeholder="Search countries" />
			<hlm-autocomplete-content *hlmAutocompletePortal>
				<hlm-autocomplete-empty>No countries found.</hlm-autocomplete-empty>
				<div hlmAutocompleteList>
					@for (country of filteredCountries(); track $index) {
						<hlm-autocomplete-item [value]="country">{{ country.flag }} {{ country.name }}</hlm-autocomplete-item>
					}
				</div>
			</hlm-autocomplete-content>
		</hlm-autocomplete>
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

const frameworks = ['Angular', 'React', 'Vue', 'Svelte', 'Solid', 'Ember', 'Next.js', 'Nuxt', 'Remix', 'Astro'];

// ── With Reactive Form ───────────────────────────────────────────────────────

export const WithReactiveForm: Story = {
	render: () => ({
		template: '<autocomplete-reactive-form-story />',
	}),
};

export const WithHintAndError: Story = {
	render: () => ({
		template: '<autocomplete-hint-error-story />',
	}),
};
