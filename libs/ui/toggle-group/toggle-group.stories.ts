import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';
import { BrnToggleGroupItemDirective, BrnToggleGroupModule } from '@spartan-ng/brain/toggle-group';

import { HlmIconDirective } from '../icon/helm/src';
import { HlmToggleGroupItemDirective, HlmToggleGroupDirective, HlmToggleGroupModule } from './helm/src';
import { Component, input, signal } from '@angular/core';
import { HlmButtonDirective } from '../button/helm/src';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { hlmP } from '../typography/helm/src';
import { BooleanInput } from '@angular/cdk/coercion';
import { JsonPipe } from '@angular/common';

const meta: Meta<HlmToggleGroupDirective> = {
	title: 'Toggle Group',
	component: HlmToggleGroupDirective,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [
				BrnToggleGroupModule,
				HlmToggleGroupModule,
				BrnToggleGroupItemDirective,
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
	render: () => ({
		template: `
		<div class="flex items-center justify-center p-4">
	<brn-toggle-group hlm multiple="false" nullable="true">
	 <button aria-label="Bold Toggle" value="bold" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideBold" />
	 </button>

	 <button aria-label="Italic Toggle" value="italic" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideItalic" />
	 </button>

	 <button aria-label="Underline Toggle" value="underline" hlmToggleGroupItem>
	   <ng-icon hlm size="sm" name="lucideUnderline" />
	 </button>
			</brn-toggle-group>
		</div>
		`,
	}),
};

export const Outline: Story = {
	render: () => ({
		template: `
		<div class="flex items-center justify-center p-4">
	<brn-toggle-group hlm multiple="true" nullable="true" variant="outline">
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
	render: () => ({
		template: `
	<div class="flex items-center justify-center p-4">
	<brn-toggle-group hlm multiple="false" nullable="true" size="sm">
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
	render: () => ({
		template: `
		<div class="flex items-center justify-center p-4">
<brn-toggle-group hlm multiple="false" nullable="true" size="lg">
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
	standalone: true,
	imports: [BrnToggleGroupModule, HlmToggleGroupModule, HlmToggleGroupItemDirective, HlmButtonDirective, FormsModule],
	template: `
		<div class="flex p-4 space-x-4">
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

		<p class="${hlmP}">{{ multiple ? 'Cities' : 'City' }} selected: {{ selectedCities }}</p>
	`,
})
class HlmToggleGroupStoryComponent {
	public multiple = input<BooleanInput>(false);
	public nullable = input<BooleanInput>(false);
	public disabled = input<BooleanInput>(false);
	public selected = signal<City | City[] | undefined>(undefined);

	private _cities: City[] = [...CITIES];
	public get cities(): City[] {
		return this._cities;
	}

	get selectedCities() {
		if (!this.selected()) {
			return this.multiple() ? 'No cities selected' : 'No city selected';
		}

		if (Array.isArray(this.selected())) {
			// @ts-expect-error
			if (this.selected()?.length === 0) return 'No cities selected';
			return (
				this.selected()
					// @ts-expect-error
					?.map((c) => c.name)
					.join(',')
			);
		}

		// @ts-expect-error
		return this.selected()?.name;
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

export const ToggleGroupMultipleNullable: StoryObj<{ cities: City[] }> = {
	name: 'Toggle Group - Multiple Nullable',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupStoryComponent],
		}),
	],
	args: {
		cities: [CITIES[0]],
	},
	render: ({ cities }) => ({
		props: { cities },
		template: '<hlm-toggle-group-story nullable="true" multiple="true"/>',
	}),
};

export const ToggleGroupSingle: StoryObj<{ city: City }> = {
	name: 'Toggle Group - Single',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupStoryComponent],
		}),
	],
	args: {
		city: CITIES[0],
	},
	render: ({ city }) => ({
		props: { city },
		template: '<hlm-toggle-group-story [selected]="city"/>',
	}),
};

export const ToggleGroupDisabled: StoryObj<{ city: City }> = {
	name: 'Toggle Group - Disabled',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupStoryComponent],
		}),
	],
	args: {
		city: CITIES[0],
	},
	render: ({ city }) => ({
		props: { city },
		template: '<hlm-toggle-group-story [disabled]="true" [selected]="city"/>',
	}),
};

export const ToggleGroupMultiple: StoryObj<{ cities: City[] }> = {
	name: 'Toggle Group - Multiple',
	decorators: [
		moduleMetadata({
			imports: [HlmToggleGroupStoryComponent],
		}),
	],
	args: {
		cities: [CITIES[0]],
	},
	render: ({ cities }) => ({
		props: { cities },
		template: '<hlm-toggle-group-story [selected]="cities" multiple="true"/>',
	}),
};

@Component({
	selector: 'hlm-toggle-group-form-story',
	standalone: true,
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

export const ToggleGroupForm: StoryObj<{}> = {
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
