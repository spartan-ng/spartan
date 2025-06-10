import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';
import {
	BrnToggleGroupComponent,
	BrnToggleGroupItemDirective,
	BrnToggleGroupModule,
} from '@spartan-ng/brain/toggle-group';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';

import { BooleanInput } from '@angular/cdk/coercion';
import { JsonPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import {
	HlmToggleGroupDirective,
	HlmToggleGroupItemDirective,
	HlmToggleGroupModule,
} from '@spartan-ng/helm/toggle-group';
import { hlmP } from '@spartan-ng/helm/typography';

const meta: Meta<HlmToggleGroupDirective> = {
	title: 'Toggle Group',
	component: HlmToggleGroupDirective,
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
			imports: [
				BrnToggleGroupComponent,
				// BrnToggleGroupModule,
				HlmToggleGroupModule,
				BrnToggleGroupItemDirective,
				HlmToggleGroupDirective,
				HlmToggleGroupItemDirective,
				NgIcon,
				HlmIconDirective,
			],
			providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmToggleGroupDirective>;

export const Default: Story = {
	render: (args) => ({
		template: `
		<div class="flex items-center justify-center p-4">
	 <brn-toggle-group hlm multiple="false" nullable="true" ${argsToTemplate(args)} >
	 <button aria-label="Bold Toggle" value="bold" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideBold" ${argsToTemplate(args)} />
	 </button>

	 <button aria-label="Italic Toggle" value="italic" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideItalic" ${argsToTemplate(args)} />
	 </button>

	 <button aria-label="Underline Toggle" value="underline" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideUnderline" ${argsToTemplate(args)} />
	 </button>
			</brn-toggle-group>
		</div>
		`,
	}),
};

export const Outline: Story = {
	render: (args) => ({
		template: `
		<div class="flex items-center justify-center p-4">
	<brn-toggle-group hlm size="sm" variant="outline" multiple="true" nullable="true" ${argsToTemplate(args)}>
	 <button aria-label="Bold" value="bold" hlmToggleGroupItem>
		 <ng-icon hlm size="sm" name="lucideBold" />
	 </button>

	 <button aria-label="Italic" value="italic" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideItalic" />
	 </button>

	 <button aria-label="Underline" value="underline" hlmToggleGroupItem>
	 	 <ng-icon hlm size="sm" name="lucideUnderline" />
	 </button>
	</brn-toggle-group>
		</div>
		`,
	}),
};

export const Small: Story = {
	render: (args) => ({
		template: `
	<div class="flex items-center justify-center p-4">
	<brn-toggle-group hlm size="sm" ${argsToTemplate(args)} multiple="false" nullable="true" >
	<button aria-label="Bold" value="bold" hlmToggleGroupItem>
	 <ng-icon hlm size="sm" name="lucideBold" />
	</button>
	<button aria-label="Italic" value="italic" hlmToggleGroupItem>
	  <ng-icon hlm size="sm" name="lucideItalic" />
	</button>
	<button aria-label="Underline" value="underline" hlmToggleGroupItem>
		 <ng-icon hlm size="sm" name="lucideUnderline" />
	</button>
	</brn-toggle-group>
	</div>
		`,
	}),
};

export const Large: Story = {
	render: (args) => ({
		template: `
		<div class="flex items-center justify-center p-4">
<brn-toggle-group hlm ${argsToTemplate(args)} multiple="false" nullable="true" size="lg">
	 <button aria-label="Bold" value="bold" hlmToggleGroupItem>
		 <ng-icon hlm size="lg" name="lucideBold" />
	 </button>

	 <button aria-label="Italic" value="italic" hlmToggleGroupItem>
	   <ng-icon hlm size="lg" name="lucideItalic" />
	 </button>

	 <button aria-label="Underline" value="underline" hlmToggleGroupItem>
	 	 <ng-icon hlm size="lg" name="lucideUnderline" />
	 </button>
	</brn-toggle-group>
		</div>
		`,
	}),
};

export const Disabled: Story = {
	render: () => ({
		template: `
	<div class="flex items-center justify-center p-4">
  <brn-toggle-group hlm multiple="false" nullable="true" size="sm" disabled>
	<button aria-label="Bold" value="bold" hlmToggleGroupItem>
		 <ng-icon hlm size="sm" name="lucideBold" />
	</button>
	<button aria-label="Italic" value="italic" hlmToggleGroupItem>
	  <ng-icon hlm size="sm" name="lucideItalic" />
	</button>
	<button aria-label="Underline" value="underline" hlmToggleGroupItem>
		 <ng-icon hlm size="sm" name="lucideUnderline" />
	</button>
	</brn-toggle-group>
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
	imports: [BrnToggleGroupModule, HlmToggleGroupModule, HlmToggleGroupItemDirective, HlmButtonDirective, FormsModule],
	template: `
		<div class="flex space-x-4 p-4">
			<brn-toggle-group
				hlm
				[disabled]="disabled()"
				[nullable]="nullable()"
				[multiple]="multiple()"
				[(ngModel)]="selected"
				variant="merged"
			>
				@for (city of cities; track city.name; let last = $last) {
					<button [value]="city" hlmToggleGroupItem>
						{{ city.name }}
					</button>
				}
			</brn-toggle-group>

			<button hlmBtn size="sm" (click)="setToSyracuse()">Set to Syracuse</button>
			<button hlmBtn size="sm" (click)="addCity()">Add Piraeus</button>
		</div>

		<p class="${hlmP}">{{ multiple() ? 'Cities selected' : 'City selected' }}: {{ selectedCities }}</p>
	`,
})
class HlmToggleGroupStoryComponent {
	public multiple = input<BooleanInput>(false);
	public nullable = input<BooleanInput>(false);
	public disabled = input<BooleanInput>(false);
	public defaultValue = input<City | City[] | undefined>(undefined);
	public selected = signal<City | City[] | undefined>(undefined);

	private _cities: City[] = [...CITIES];
	public get cities(): City[] {
		return this._cities;
	}

	ngOnInit() {
		this.selected.set(this.defaultValue());
	}

	get selectedCities() {
		if (!this.selected()) {
			return this.multiple() ? 'No cities selected' : 'No city selected';
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
		this.selected.set(this.multiple() ? [this.cities[3]] : this.cities[3]);
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
			imports: [HlmToggleGroupStoryComponent],
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
			imports: [HlmToggleGroupStoryComponent],
		}),
	],
	render: () => ({
		template: '<hlm-toggle-group-story nullable="true" multiple="true"/>',
	}),
};

export const ToggleGroupSingle: StoryObj<{ defaultValue: City }> = {
	name: 'Toggle Group - Single',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupStoryComponent],
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
			imports: [HlmToggleGroupStoryComponent],
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
			imports: [HlmToggleGroupStoryComponent],
		}),
	],
	args: {
		defaultValue: [CITIES[0]],
	},
	render: ({ defaultValue }) => ({
		props: { defaultValue },
		template: '<hlm-toggle-group-story multiple="true" [defaultValue]="defaultValue"/>',
	}),
};

@Component({
	selector: 'hlm-toggle-group-form-story',
	imports: [
		BrnToggleGroupModule,
		HlmToggleGroupModule,
		HlmToggleGroupItemDirective,
		FormsModule,
		ReactiveFormsModule,
		JsonPipe,
	],
	template: `
		<form class="flex space-x-4 p-4" [formGroup]="citiesForm">
			<brn-toggle-group hlm formControlName="selectedCity" variant="merged">
				@for (city of cities; track city.name; let last = $last) {
					<button [value]="city" hlmToggleGroupItem>
						{{ city.name }}
					</button>
				}
			</brn-toggle-group>
		</form>

		<pre class="${hlmP}" data-testid="selectedCity">{{ citiesForm.controls.selectedCity?.getRawValue()?.name }}</pre>
	`,
})
class HlmToggleGroupFormStoryComponent {
	protected readonly cities: City[] = CITIES;
	protected readonly citiesForm = new FormGroup({
		selectedCity: new FormControl(CITIES[0]),
	});
}

export const ToggleGroupForm: Story = {
	name: 'Toggle Group - Form',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupFormStoryComponent],
		}),
	],
	render: () => ({
		template: '<hlm-toggle-group-form-story/>',
	}),
};
