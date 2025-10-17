import { ApplicationRef, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmAutocomplete<string>> = {
	title: 'Autocomplete',
	component: HlmAutocomplete,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmAutocomplete],
		}),
	],
};

export default meta;

type Story = StoryObj<HlmAutocomplete<string>>;

const fruits = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grapes', 'Mango', 'Orange', 'Peach', 'Pineapple', 'Strawberry'];

@Component({
	selector: 'autocomplete-basic-story',
	standalone: true,
	imports: [HlmAutocomplete],
	template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-autocomplete
				class="w-[300px]"
				[filteredOptions]="filteredOptions()"
				searchPlaceholderText="Search fruits..."
				emptyText="No fruit found"
				(searchChange)="onSearchChange($event)"
				(valueChange)="onValueChange($event)"
			/>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class AutocompleteBasicStory {
	public readonly filteredOptions = signal<string[]>(fruits);

	onSearchChange(search: string) {
		this.filteredOptions.set(fruits.filter((fruit) => fruit.toLowerCase().includes(search.toLowerCase())));
	}

	onValueChange(value: string | null) {
		console.log('Selected value:', value);
	}
}

export const Default: Story = {
	decorators: [
		moduleMetadata({
			imports: [AutocompleteBasicStory],
		}),
	],
	render: () => ({
		template: '<autocomplete-basic-story />',
	}),
};

@Component({
	selector: 'autocomplete-form-field-story',
	standalone: true,
	imports: [ReactiveFormsModule, HlmLabelImports, HlmFormFieldImports, HlmAutocomplete],
	template: `
		<div class="space-y-8 max-w-md">
			<hlm-form-field>
				<label hlmLabel>Favorite Fruit</label>
				<hlm-autocomplete
					[formControl]="favoriteFruit"
					[filteredOptions]="filteredFruits()"
					searchPlaceholderText="Search fruits..."
					emptyText="No fruit found"
					(searchChange)="onFruitSearchChange($event)"
				/>
				<hlm-hint>Choose your favorite fruit</hlm-hint>
				<hlm-error>Please select a fruit</hlm-error>
			</hlm-form-field>

			<hlm-form-field>
				<label hlmLabel>Country</label>
				<hlm-autocomplete
					[formControl]="country"
					[filteredOptions]="filteredCountries()"
					searchPlaceholderText="Search countries..."
					emptyText="No country found"
					(searchChange)="onCountrySearchChange($event)"
				/>
				<hlm-hint>Select your country of residence</hlm-hint>
				<hlm-error>Country is required</hlm-error>
			</hlm-form-field>

			<hlm-form-field>
				<label hlmLabel>Programming Language (Optional)</label>
				<hlm-autocomplete
					[formControl]="programmingLanguage"
					[filteredOptions]="filteredLanguages()"
					searchPlaceholderText="Search languages..."
					emptyText="No language found"
					(searchChange)="onLanguageSearchChange($event)"
				/>
				<hlm-hint>Optional: Choose your preferred programming language</hlm-hint>
				<hlm-error>Invalid selection</hlm-error>
			</hlm-form-field>

			<div class="flex gap-2 pt-4 border-t">
				<button
					class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
					(click)="markAllAsTouched()"
				>
					Validate Form
				</button>
				<button
					class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
					(click)="resetForm()"
				>
					Reset
				</button>
			</div>

			<div class="p-4 rounded-md bg-muted">
				<h3 class="text-sm font-semibold mb-2">Form Values:</h3>
				<pre class="text-xs">{{ getFormValues() }}</pre>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class AutocompleteFormFieldStory {
	private readonly _appRef = inject(ApplicationRef);

	// Form controls
	public readonly favoriteFruit = new FormControl<string | null>(null, Validators.required);
	public readonly country = new FormControl<string | null>(null, Validators.required);
	public readonly programmingLanguage = new FormControl<string | null>(null);

	// Data
	private readonly allFruits = fruits;
	private readonly allCountries = [
		'United States',
		'Canada',
		'United Kingdom',
		'Germany',
		'France',
		'Spain',
		'Italy',
		'Japan',
		'Australia',
		'Brazil',
		'India',
		'China',
	];
	private readonly allLanguages = [
		'JavaScript',
		'TypeScript',
		'Python',
		'Java',
		'C#',
		'C++',
		'Go',
		'Rust',
		'Swift',
		'Kotlin',
		'Ruby',
		'PHP',
	];

	// Filtered options
	public readonly filteredFruits = signal<string[]>(this.allFruits);
	public readonly filteredCountries = signal<string[]>(this.allCountries);
	public readonly filteredLanguages = signal<string[]>(this.allLanguages);

	onFruitSearchChange(search: string) {
		this.filteredFruits.set(
			this.allFruits.filter((fruit) => fruit.toLowerCase().includes(search.toLowerCase())),
		);
	}

	onCountrySearchChange(search: string) {
		this.filteredCountries.set(
			this.allCountries.filter((country) => country.toLowerCase().includes(search.toLowerCase())),
		);
	}

	onLanguageSearchChange(search: string) {
		this.filteredLanguages.set(
			this.allLanguages.filter((lang) => lang.toLowerCase().includes(search.toLowerCase())),
		);
	}

	markAllAsTouched() {
		this.favoriteFruit.markAsTouched();
		this.country.markAsTouched();
		this.programmingLanguage.markAsTouched();
		// Trigger a full application-wide change detection cycle
		this._appRef.tick();
	}

	resetForm() {
		this.favoriteFruit.reset();
		this.country.reset();
		this.programmingLanguage.reset();
	}

	getFormValues() {
		return JSON.stringify(
			{
				favoriteFruit: this.favoriteFruit.value || null,
				country: this.country.value || null,
				programmingLanguage: this.programmingLanguage.value || null,
				valid: this.favoriteFruit.valid && this.country.valid,
			},
			null,
			2,
		);
	}
}

export const FormField: Story = {
	decorators: [
		moduleMetadata({
			imports: [AutocompleteFormFieldStory],
		}),
	],
	render: () => ({
		template: '<autocomplete-form-field-story />',
	}),
};

