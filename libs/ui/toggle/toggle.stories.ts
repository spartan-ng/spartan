import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';
import { BrnToggleDirective, BrnToggleGroupModule } from '@spartan-ng/brain/toggle';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconDirective } from '../icon/helm/src';
import { hlmP } from '../typography/helm/src';
import { HlmToggleDirective, HlmToggleGroupModule } from './helm/src';

const meta: Meta<HlmToggleDirective> = {
	title: 'Toggle',
	component: HlmToggleDirective,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmToggleDirective, BrnToggleDirective, NgIcon, HlmIconDirective],
			providers: [provideIcons({ lucideItalic })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmToggleDirective>;

export const Default: Story = {
	render: () => ({
		template: `
    <div class='space-x-3'>
    <button aria-label='Italic Toggle' size='sm' hlmToggle><ng-icon hlm name='lucideItalic'/></button>
    <button aria-label='Italic Toggle' hlmToggle><ng-icon hlm name='lucideItalic'/></button>
    <button aria-label='Italic Toggle' size='lg' hlmToggle><ng-icon hlm name='lucideItalic'/></button>
    <button aria-label='Italic Toggle' variant='outline' hlmToggle><ng-icon hlm name='lucideItalic'/></button>
    <button aria-label='Italic Toggle' disabled hlmToggle><ng-icon hlm name='lucideItalic'/></button>
    </div>
    `,
	}),
};

export const WithText: Story = {
	name: 'With Text',
	render: () => ({
		template: `
    <div class='space-x-3'>
    <button size='sm' hlmToggle><ng-icon hlm name='lucideItalic'/> <span class='ml-2'>Italic</span></button>
    <button hlmToggle><ng-icon hlm name='lucideItalic'/> <span class='ml-2'>Italic</span></button>
    <button size='lg' hlmToggle><ng-icon hlm name='lucideItalic'/> <span class='ml-2'>Italic</span></button>
    <button variant='outline' hlmToggle><ng-icon hlm name='lucideItalic'/> <span class='ml-2'>Italic</span></button>
    <button disabled hlmToggle><ng-icon hlm name='lucideItalic'/> <span class='ml-2'>Italic</span></button>
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
	imports: [BrnToggleGroupModule, HlmToggleGroupModule, HlmButtonDirective, FormsModule, NgForOf, NgIf],
	template: `
		<div class="flex space-x-4">
			<brn-toggle-group
				hlm
				[disabled]="disabled"
				[nullable]="nullable"
				[multiple]="multiple"
				[(ngModel)]="selected"
				variant="merged"
			>
				<button variant="outline" *ngFor="let city of cities; let last = last" [value]="city" hlm brnToggle>
					{{ city.name }}
				</button>
			</brn-toggle-group>
			<button hlmBtn size="sm" (click)="setToSyracuse()">Set to Syracuse</button>
			<button hlmBtn size="sm" (click)="addCity()">Add Piraeus</button>
		</div>

		<p class="${hlmP}">{{ multiple ? 'Cities' : 'City' }} selected: {{ selectedCities }}</p>
	`,
})
class HlmToggleGroupStoryComponent {
	@Input()
	multiple = false;
	@Input()
	nullable = false;
	@Input()
	disabled = false;
	public readonly cities: City[] = CITIES;
	@Input()
	public selected?: City | City[];

	get selectedCities() {
		if (!this.selected) {
			return this.multiple ? 'No cities selected' : 'No city selected';
		}

		if (Array.isArray(this.selected)) {
			if (this.selected.length === 0) return 'No cities selected';
			return this.selected.map((c) => c.name).join(',');
		}
		return this.selected.name;
	}

	setToSyracuse() {
		this.selected = this.multiple ? [this.cities[3]] : this.cities[3];
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
	imports: [BrnToggleGroupModule, HlmToggleGroupModule, FormsModule, NgForOf, ReactiveFormsModule, JsonPipe],
	template: `
		<form class="flex space-x-4" [formGroup]="citiesForm">
			<brn-toggle-group hlm formControlName="selectedCity">
				<button variant="outline" *ngFor="let city of cities; let last = last" [value]="city" hlm brnToggle>
					{{ city.name }}
				</button>
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
