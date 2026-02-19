import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HlmRangeSliderImports, type RangeValue } from '@spartan-ng/helm/range-slider';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

interface HlmRangeSliderStoryArgs {
	value: RangeValue;
	disabled: boolean;
	min: number;
	max: number;
	step: number;
}

const meta: Meta<HlmRangeSliderStoryArgs> = {
	title: 'Range Slider',
	tags: ['autodocs'],
	args: {
		value: [20, 80],
		disabled: false,
		min: 0,
		max: 100,
		step: 1,
	},
	decorators: [
		moduleMetadata({
			imports: [FormsModule, ReactiveFormsModule, HlmRangeSliderImports],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmRangeSliderStoryArgs>;

export const Default: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-range-slider [value]="value" [min]="min" [max]="max" [step]="step" (valueChange)="value = $event" />
			<p class="text-muted-foreground mt-2 text-sm">Value: {{ value }}</p>
		`,
	}),
};

export const CustomRange: Story = {
	args: {
		value: [25, 75],
		min: 0,
		max: 200,
		step: 5,
	},
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-range-slider [value]="value" [min]="min" [max]="max" [step]="step" (valueChange)="value = $event" />
			<p class="text-muted-foreground mt-2 text-sm">Value: {{ value }} (min: {{ min }}, max: {{ max }}, step: {{ step }})</p>
		`,
	}),
};

export const Disabled: Story = {
	args: {
		value: [30, 70],
		disabled: true,
	},
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-range-slider [value]="value" [disabled]="disabled" />
		`,
	}),
};

export const SmallRange: Story = {
	args: {
		value: [40, 60],
		min: 0,
		max: 100,
		step: 1,
	},
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-range-slider [value]="value" [min]="min" [max]="max" [step]="step" (valueChange)="value = $event" />
			<p class="text-muted-foreground mt-2 text-sm">Selected: {{ value[0] }} – {{ value[1] }}</p>
		`,
	}),
};

export const PriceFilter: Story = {
	args: {
		value: [100, 500],
		min: 0,
		max: 1000,
		step: 10,
	},
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<div class="w-80">
				<label class="text-sm font-medium">Price range</label>
				<hlm-range-slider
					class="mt-2"
					[value]="value"
					[min]="min"
					[max]="max"
					[step]="step"
					(valueChange)="value = $event"
				/>
				<p class="text-muted-foreground mt-1 text-sm">\${{ value[0] }} – \${{ value[1] }}</p>
			</div>
		`,
	}),
};
