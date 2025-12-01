import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmAutocomplete } from '@spartan-ng/helm/autocomplete';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';

const frameworkOptions = [
	'Angular',
	'React',
	'Vue',
	'Svelte',
	'Solid',
	'Ember',
	'Next.js',
	'Nuxt',
	'Remix',
	'Blitz',
	'Astro',
];

const meta: Meta<HlmAutocomplete<string, string>> = {
	title: 'Autocomplete',
	tags: ['autodocs'],
	args: {
		filteredOptions: frameworkOptions,
		searchPlaceholderText: 'Type to search',
	},
	decorators: [
		moduleMetadata({
			imports: [ReactiveFormsModule, HlmFieldImports, HlmButton, HlmAutocomplete],
		}),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => ({
		props: args,
		template: `
			<div class="w-full max-w-sm space-y-1">
				<div hlmField>
					<label hlmFieldLabel for="autocomplete-default">Framework</label>
					<hlm-autocomplete
						id="autocomplete-default"
						[filteredOptions]="filteredOptions"
						[searchPlaceholderText]="searchPlaceholderText" />
					<p hlmFieldDescription>Start typing to browse modern frameworks.</p>
				</div>
			</div>
		`,
	}),
};

export const WithReactiveForm: Story = {
	render: (args) => ({
		props: { ...args, form: new FormGroup({ framework: new FormControl('', [Validators.required]) }) },
		template: /* HTML */ `
			<form [formGroup]="form" class="space-y-3">
				<div hlmField>
					<label hlmFieldLabel for="framework">Framework *</label>
					<hlm-autocomplete
						id="framework-input"
						formControlName="framework"
						[filteredOptions]="filteredOptions"
						[searchPlaceholderText]="searchPlaceholderText"
					/>
				</div>

				<div class="flex flex-wrap items-center gap-2">
					<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
				</div>
			</form>

			<p>Error state: {{ form.get('framework')?.errors | json }}</p>

			<pre>Value Changes: {{ form.get('framework')?.valueChanges | async | json }}</pre>
			<pre>Errors: {{ form.get('framework')?.errors | json }}</pre>
			<pre>Touched: {{ form.get('framework')?.touched | json }}</pre>
			<pre>Dirty: {{ form.get('framework')?.dirty | json }}</pre>
			<pre>Valid: {{ form.get('framework')?.valid | json }}</pre>
			<pre>Invalid: {{ form.get('framework')?.invalid | json }}</pre>
			<pre>Pristine: {{ form.get('framework')?.pristine | json }}</pre>
			<pre>Value: {{ form.get('framework')?.value | json }}</pre>
		`,
	}),
};

export const WithHintAndError: Story = {
	render: (args) => ({
		props: {
			...args,
			form: new FormGroup({
				framework: new FormControl('', { validators: [Validators.required] }),
			}),
		},
		template: `
			@let frameworkControl = form.get('framework');
			@let showError = frameworkControl?.invalid && (frameworkControl?.touched || frameworkControl?.dirty);

			<form [formGroup]="form" class="space-y-3 w-full max-w-sm">
				<div hlmField [attr.data-invalid]="showError ? 'true' : null">
					<label hlmFieldLabel for="framework-hint">Framework *</label>
					<hlm-autocomplete
						id="framework-hint"
						formControlName="framework"
						[filteredOptions]="filteredOptions"
						[searchPlaceholderText]="searchPlaceholderText" />

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
	}),
};

// export const WithRequiredValidation: Story = {
// 	render: () => ({
// 		template: `<autocomplete-reactive-form-tester
// 						[filteredOptions]="frameworkOptions"
// 						[searchPlaceholderText]="searchPlaceholderText" [touchedOnInit]="true"/>`,
// 	}),
// };
