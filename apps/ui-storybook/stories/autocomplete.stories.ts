import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';

const frameworks = ['Angular', 'React', 'Vue', 'Svelte', 'Solid', 'Ember', 'Next.js', 'Nuxt', 'Remix', 'Astro'];

// ── Default ──────────────────────────────────────────────────────────────────

@Component({
	selector: 'autocomplete-default-story',
	standalone: true,
	imports: [HlmAutocompleteImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-autocomplete [(search)]="search" class="w-full max-w-sm">
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
	`,
})
class AutocompleteDefaultStory {
	public readonly search = signal('');
	public readonly filteredOptions = computed(() =>
		frameworks.filter((fw) => fw.toLowerCase().includes(this.search().toLowerCase())),
	);
}

// ── With Reactive Form ───────────────────────────────────────────────────────

@Component({
	selector: 'autocomplete-reactive-form-story',
	standalone: true,
	imports: [JsonPipe, HlmAutocompleteImports, HlmFieldImports, HlmButton, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form" class="space-y-3 w-full max-w-sm">
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

		<pre class="mt-4 text-xs">Touched: {{ form.get('framework')?.touched }}  |  Invalid: {{ form.get('framework')?.invalid }}  |  Value: {{ form.get('framework')?.value | json }}</pre>
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
	standalone: true,
	imports: [HlmAutocompleteImports, HlmFieldImports, HlmButton, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@let ctrl = form.get('framework');
		@let showError = ctrl?.invalid && (ctrl?.touched || ctrl?.dirty);

		<form [formGroup]="form" class="space-y-3 w-full max-w-sm">
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

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
	title: 'Autocomplete',
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [AutocompleteDefaultStory, AutocompleteReactiveFormStory, AutocompleteHintErrorStory],
		}),
	],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => ({
		template: '<autocomplete-default-story />',
	}),
};

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
