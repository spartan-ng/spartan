import type { BooleanInput } from '@angular/cdk/coercion';
import { Component, input, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';
import { ToggleType } from '@spartan-ng/brain/toggle-group';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmToggleGroup, HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { hlmP } from '@spartan-ng/helm/typography';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmToggleGroup> = {
	title: 'Toggle Group',
	component: HlmToggleGroup,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'outline'],
			description: 'The visual style of the toggle group',
			defaultValue: 'default',
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg'],
			description: 'The size of the toggle group',
			defaultValue: 'default',
		},
		userClass: {
			control: 'text',
			description: 'Additional CSS classes to apply to the toggle group',
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupImports, NgIcon, HlmIcon],
			providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmToggleGroup>;

export const Default: Story = {
	render: (args) => ({
		template: `
		<div class="flex items-center justify-center p-4">
	 <hlm-toggle-group type="single" nullable="true" ${argsToTemplate(args)}> <button aria-label="Bold Toggle" value="bold" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideBold" ${argsToTemplate(args)} />
	 </button>

	 <button aria-label="Italic Toggle" value="italic" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideItalic" ${argsToTemplate(args)} />
	 </button>

	 <button aria-label="Underline Toggle" value="underline" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideUnderline" ${argsToTemplate(args)} />
	 </button>
			</hlm-toggle-group>
		</div>
		`,
	}),
};

export const Outline: Story = {
	render: (args) => ({
		template: `
		<div class="flex items-center justify-center p-4">
	<hlm-toggle-group size="sm" variant="outline" type="multiple" nullable="true" ${argsToTemplate(args)}> <button aria-label="Bold" value="bold" hlmToggleGroupItem>
		 <ng-icon hlm size="sm" name="lucideBold" />
	 </button>

	 <button aria-label="Italic" value="italic" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideItalic" />
	 </button>

	 <button aria-label="Underline" value="underline" hlmToggleGroupItem>
	 	 <ng-icon hlm size="sm" name="lucideUnderline" />
	 </button>
	</hlm-toggle-group>
		</div>
		`,
	}),
};

export const Small: Story = {
	render: (args) => ({
		template: `
	<div class="flex items-center justify-center p-4">
	<hlm-toggle-group size="sm" ${argsToTemplate(args)} type="single" nullable="true"> <button aria-label="Bold" value="bold" hlmToggleGroupItem>
	 <ng-icon hlm size="sm" name="lucideBold" />
	</button>
	<button aria-label="Italic" value="italic" hlmToggleGroupItem>
	  <ng-icon hlm size="sm" name="lucideItalic" />
	</button>
	<button aria-label="Underline" value="underline" hlmToggleGroupItem>
		 <ng-icon hlm size="sm" name="lucideUnderline" />
	</button>
	</hlm-toggle-group>
	</div>
		`,
	}),
};

export const Large: Story = {
	render: (args) => ({
		template: `
		<div class="flex items-center justify-center p-4">
<hlm-toggle-group ${argsToTemplate(args)} type="single" nullable="true" size="lg"> <button aria-label="Bold" value="bold" hlmToggleGroupItem>
		 <ng-icon hlm size="lg" name="lucideBold" />
	 </button>

	 <button aria-label="Italic" value="italic" hlmToggleGroupItem>
	   <ng-icon hlm size="lg" name="lucideItalic" />
	 </button>

	 <button aria-label="Underline" value="underline" hlmToggleGroupItem>
	 	 <ng-icon hlm size="lg" name="lucideUnderline" />
	 </button>
	</hlm-toggle-group>
		</div>
		`,
	}),
};

export const Disabled: Story = {
	render: () => ({
		template: `
	<div class="flex items-center justify-center p-4">
  <hlm-toggle-group type="single" nullable="true" size="sm" disabled> <button aria-label="Bold" value="bold" hlmToggleGroupItem>
		 <ng-icon hlm size="sm" name="lucideBold" />
	</button>
	<button aria-label="Italic" value="italic" hlmToggleGroupItem>
	  <ng-icon hlm size="sm" name="lucideItalic" />
	</button>
	<button aria-label="Underline" value="underline" hlmToggleGroupItem>
		 <ng-icon hlm size="sm" name="lucideUnderline" />
	</button>
	</hlm-toggle-group>
	</div>
		`,
	}),
};

type City = { name: string; population: number };
const CITIES = [
	{
		name: 'Sparta',
		population: 23234233,
	},
	{
		name: 'Athens',
		population: 989889,
	},
	{
		name: 'Corinth',
		population: 988989,
	},
	{
		name: 'Syracuse',
		population: 998889,
	},
];

@Component({
	selector: 'hlm-toggle-group-story',
	imports: [HlmToggleGroupImports, HlmButton, FormsModule],
	template: `
		<div class="flex space-x-4 p-4">
			<hlm-toggle-group
				[disabled]="disabled()"
				[nullable]="nullable()"
				[type]="type()"
				[(ngModel)]="selected"
				variant="merged"
			>
				@for (city of cities; track city.name; let last = $last) {
					<button [value]="city" hlmToggleGroupItem>
						{{ city.name }}
					</button>
				}
			</hlm-toggle-group>

			<button hlmBtn size="sm" (click)="setToSyracuse()">Set to Syracuse</button>
			<button hlmBtn size="sm" (click)="addCity()">Add Piraeus</button>
		</div>

		<p class="${hlmP}">{{ type() === 'multiple' ? 'Cities selected' : 'City selected' }}: {{ selectedCities }}</p>
	`,
})
class HlmToggleGroupStory {
	public readonly type = input<ToggleType>('single');
	public readonly nullable = input<BooleanInput>(false);
	public readonly disabled = input<BooleanInput>(false);
	public readonly defaultValue = input<City | City[] | undefined>(undefined);
	public readonly selected = signal<City | City[] | undefined>(undefined);

	private _cities: City[] = [...CITIES];
	public get cities(): City[] {
		return this._cities;
	}

	ngOnInit() {
		this.selected.set(this.defaultValue());
	}

	get selectedCities() {
		if (!this.selected()) {
			return this.type() === 'multiple' ? 'No cities selected' : 'No city selected';
		}

		if (Array.isArray(this.selected())) {
			const selectedArray = this.selected() as City[];
			if (selectedArray.length === 0) return 'No cities selected';

			return selectedArray.map((c) => c.name).join(',');
		}

		// At this point, selected must be a single City
		const selectedCity = this.selected() as City;
		return selectedCity.name;
	}

	setToSyracuse() {
		this.selected.set(this.type() === 'multiple' ? [this.cities[3]] : this.cities[3]);
	}

	addCity() {
		this.cities.push({
			name: 'Piraeus',
			population: 998889,
		});
	}
}

export const ToggleGroupSingleNullable: Story = {
	name: 'Toggle Group - Single Nullable',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupStory],
		}),
	],
	render: () => ({
		template: '<hlm-toggle-group-story nullable="true"/>',
	}),
};

export const ToggleGroupMultipleNullable: Story = {
	name: 'Toggle Group - Multiple Nullable',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupStory],
		}),
	],
	render: () => ({
		template: '<hlm-toggle-group-story nullable="true" type="multiple"/>',
	}),
};

export const ToggleGroupSingle: StoryObj<{ defaultValue: City }> = {
	name: 'Toggle Group - Single',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupStory],
		}),
	],
	args: {
		defaultValue: CITIES[0],
	},
	render: ({ defaultValue }) => ({
		props: { defaultValue },
		template: '<hlm-toggle-group-story nullable="false" [defaultValue]="defaultValue"/>',
	}),
};

export const ToggleGroupDisabled: Story = {
	name: 'Toggle Group - Disabled',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupStory],
		}),
	],
	render: () => ({
		template: '<hlm-toggle-group-story [disabled]="true"/>',
	}),
};

export const ToggleGroupMultiple: StoryObj<{ defaultValue: City[] }> = {
	name: 'Toggle Group - Multiple',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupStory],
		}),
	],
	args: {
		defaultValue: [CITIES[0]],
	},
	render: ({ defaultValue }) => ({
		props: { defaultValue },
		template: '<hlm-toggle-group-story type="multiple" [defaultValue]="defaultValue"/>',
	}),
};

@Component({
	selector: 'hlm-toggle-group-form-story',
	imports: [HlmToggleGroupImports, FormsModule, ReactiveFormsModule],
	template: `
		<form class="flex space-x-4 p-4" [formGroup]="citiesForm">
			<hlm-toggle-group formControlName="selectedCity">
				@for (city of cities; track city.name; let last = $last) {
					<button [value]="city" hlmToggleGroupItem>
						{{ city.name }}
					</button>
				}
			</hlm-toggle-group>
		</form>

		<pre class="${hlmP}" data-testid="selectedCity">{{ citiesForm.controls.selectedCity?.getRawValue()?.name }}</pre>
	`,
})
class HlmToggleGroupFormStory {
	protected readonly cities: City[] = CITIES;
	protected readonly citiesForm = new FormGroup({
		selectedCity: new FormControl(CITIES[0]),
	});
}

export const ToggleGroupForm: Story = {
	name: 'Toggle Group - Form',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupFormStory],
		}),
	],
	render: () => ({
		template: '<hlm-toggle-group-form-story/>',
	}),
};
