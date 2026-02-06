import { signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrnSliderImports } from '@spartan-ng/brain/slider';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

interface BrnSliderStoryArgs {
	value: number[];
	disabled: boolean;
	min: number;
	max: number;
	step: number;
	minStepsBetweenThumbs: number;
	inverted: boolean;
	orientation: 'horizontal' | 'vertical';
	showTicks: boolean;
	maxTicks: number;
	tickLabelInterval: number;
}

const meta: Meta<BrnSliderStoryArgs> = {
	title: 'Slider',
	tags: ['autodocs'],
	args: {
		value: [0],
		disabled: false,
		min: 0,
		max: 100,
		step: 1,
		minStepsBetweenThumbs: 0,
		inverted: false,
		orientation: 'horizontal',
		showTicks: false,
		maxTicks: 25,
		tickLabelInterval: 2,
	},
	decorators: [
		moduleMetadata({
			imports: [FormsModule, ReactiveFormsModule, HlmSliderImports, BrnSliderImports, HlmButton],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSliderStoryArgs>;

export const Default: Story = {
	args: {
		value: [0],
	},
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const Range: Story = {
	args: {
		value: [20, 50],
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const Disabled: Story = {
	args: {
		value: [50],
		disabled: true,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} />
		`,
	}),
};

export const Min: Story = {
	args: {
		min: 10,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const Max: Story = {
	args: {
		value: [0],
		max: 75,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const MinMax: Story = {
	args: {
		min: 10,
		max: 90,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const Step: Story = {
	args: {
		step: 5,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const MinStepsBetweenThumbs: Story = {
	args: {
		step: 5,
		value: [30, 70],
		minStepsBetweenThumbs: 2,
		showTicks: true,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const Inverted: Story = {
	args: {
		inverted: true,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const Vertical: Story = {
	args: {
		orientation: 'vertical',
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const Ticks: Story = {
	args: {
		step: 5,
		showTicks: true,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const TickLabelInterval: Story = {
	args: {
		step: 5,
		showTicks: true,
		tickLabelInterval: 10,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const TemplateDrivenForm: Story = {
	render: (args) => ({
		props: { ...args, temperature: signal([10]) },
		template: /* HTML */ `
			<form ngForm>
				<div>
					<pre>{{temperature()}}</pre>
				</div>
				<hlm-slider ${argsToTemplate(args)} [(ngModel)]="temperature" name="temperature" />

				<button hlmBtn class="mt-3" (click)="temperature.set([25])">Change temperature value</button>
			</form>
		`,
	}),
};

export const ReactiveFormControl: Story = {
	render: (args) => ({
		props: { ...args, temperatureGroup: new FormGroup({ temperature: new FormControl() }) },
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ temperatureGroup.controls.temperature.valueChanges | async | json }}</pre>
			</div>
			<form [formGroup]="temperatureGroup">
				<hlm-slider ${argsToTemplate(args)} formControlName="temperature" />
			</form>
		`,
	}),
};

export const ReactiveFormControlWithInitialValue: Story = {
	render: (args) => ({
		props: { ...args, temperatureGroup: new FormGroup({ temperature: new FormControl([26]) }) },
		template: /* HTML */ `
			<div class="mb-3">
				<pre>Form Control Value: {{ temperatureGroup.controls.temperature.valueChanges | async | json }}</pre>
			</div>
			<form [formGroup]="temperatureGroup">
				<hlm-slider ${argsToTemplate(args)} formControlName="temperature" />
			</form>
		`,
	}),
};
