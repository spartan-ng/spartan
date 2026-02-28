import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnSliderImports } from '@spartan-ng/brain/slider';
import { HlmButton, HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

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
	draggableRange: boolean;
	draggableRangeOnly: boolean;
}

@Component({
	selector: 'slider-validation-tester',
	imports: [HlmSliderImports, HlmFieldImports, ReactiveFormsModule, HlmButtonImports],

	template: `
		<form [formGroup]="form" class="max-w-lg space-y-3">
			<div hlmField [attr.data-invalid]="isInvalid() ? 'true' : null">
				<label hlmFieldLabel for="temperature-slider">Temperature</label>
				<hlm-slider id="temperature-slider" formControlName="temperature" [min]="0" [max]="100"></hlm-slider>
				@if (isInvalid()) {
					<hlm-field-error>Set the temperature before continuing.</hlm-field-error>
				}
			</div>

			<div class="flex gap-2">
				<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
				<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
			</div>
		</form>
	`,
})
class SliderValidationTester {
	public readonly form = inject(FormBuilder).group({
		temperature: [[0], Validators.min(100)],
	});

	isInvalid() {
		const control = this.form.get('temperature');
		return !!control && control.invalid && control.touched;
	}
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
		draggableRange: false,
		draggableRangeOnly: false,
	},
	decorators: [
		moduleMetadata({
			imports: [
				FormsModule,
				ReactiveFormsModule,
				HlmSliderImports,
				BrnSliderImports,
				HlmButton,
				SliderValidationTester,
			],
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

export const DraggableRange: Story = {
	args: {
		value: [25, 50],
		step: 5,
		showTicks: true,
		tickLabelInterval: 10,
		draggableRange: true,
	},
	render: ({ ...args }) => ({
		props: args,
		template: /* HTML */ `
			<hlm-slider ${argsToTemplate(args)} (valueChange)="value = $event" />

			<div>{{value}}</div>
		`,
	}),
};

export const DraggableRangeOnly: Story = {
	args: {
		value: [25, 50, 75],
		step: 5,
		showTicks: true,
		tickLabelInterval: 10,
		draggableRange: true,
		draggableRangeOnly: true,
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

export const Validation: Story = {
	name: 'Reactive Validation',
	render: () => ({
		template: `<slider-validation-tester></slider-validation-tester>`,
	}),
};
