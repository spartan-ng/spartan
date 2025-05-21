import { signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrnSliderImports } from '@spartan-ng/brain/slider';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

interface BrnSliderStoryArgs {
	value: number;
	disabled: boolean;
	min: number;
	max: number;
	step: number;
	showTicks: boolean;
}

const meta: Meta<BrnSliderStoryArgs> = {
	title: 'Slider',
	tags: ['autodocs'],
	args: {
		disabled: false,
	},
	decorators: [
		moduleMetadata({
			imports: [FormsModule, ReactiveFormsModule, HlmSliderImports, BrnSliderImports],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSliderStoryArgs>;

export const Default: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} />

			<div>{{value}}</div>
		`,
	}),
};

export const Disabled: Story = {
	args: {
		value: 50,
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
		value: 0,
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

export const TemplateDrivenForm: Story = {
	render: (args) => ({
		props: { ...args, temperature: signal('0') },
		template: /* HTML */ `
			<form ngForm>
				<div>
					<pre>{{temperature()}}</pre>
				</div>
				<hlm-slider ${argsToTemplate(args)} [(ngModel)]="temperature" name="temperature" />

				<button (click)="temperature.set(25)">Change temperature value</button>
			</form>
		`,
	}),
};

export const TemplateDrivenFormWithInitialValue: Story = {
	render: (args) => ({
		props: { ...args, temperature: signal(12) },
		template: /* HTML */ `
			<form ngForm>
				<div>
					<pre>{{temperature()}}</pre>
				</div>
				<hlm-slider ${argsToTemplate(args)} [(ngModel)]="temperature" name="temperature" />

				<button (click)="temperature.set(25)">Change temperature value</button>
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
		props: { ...args, temperatureGroup: new FormGroup({ temperature: new FormControl(26) }) },
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
