import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { BrnTimeValue } from '@spartan-ng/brain/time-input';
import { HlmTimeInputImports } from '@spartan-ng/helm/time-input';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

interface HlmTimeInputStoryArgs {
	value: BrnTimeValue;
	disabled: boolean;
	displaySeconds: boolean;
}

const meta: Meta<HlmTimeInputStoryArgs> = {
	title: 'Time Input',
	tags: ['autodocs'],
	args: {
		value: { hours: 12, minutes: 0, seconds: 0, period: 'AM' },
		disabled: false,
		displaySeconds: false,
	},
	decorators: [
		moduleMetadata({
			imports: [FormsModule, ReactiveFormsModule, HlmTimeInputImports],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmTimeInputStoryArgs>;

export const Default: Story = {
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-time-input [value]="value" (valueChange)="value = $event" />
			<p class="text-muted-foreground mt-2 text-sm">{{ value.hours }}:{{ value.minutes | number: '2.0-0' }} {{ value.period }}</p>
		`,
	}),
};

export const WithSeconds: Story = {
	args: {
		value: { hours: 3, minutes: 30, seconds: 45, period: 'PM' },
		displaySeconds: true,
	},
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-time-input [value]="value" [displaySeconds]="displaySeconds" (valueChange)="value = $event" />
			<p class="text-muted-foreground mt-2 text-sm">
				{{ value.hours }}:{{ value.minutes | number: '2.0-0' }}:{{ value.seconds | number: '2.0-0' }} {{ value.period }}
			</p>
		`,
	}),
};

export const Disabled: Story = {
	args: {
		value: { hours: 9, minutes: 15, seconds: 0, period: 'AM' },
		disabled: true,
	},
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<hlm-time-input [value]="value" [disabled]="disabled" />
		`,
	}),
};

export const PresetTime: Story = {
	args: {
		value: { hours: 5, minutes: 45, seconds: 0, period: 'PM' },
	},
	render: (args) => ({
		props: { ...args },
		template: /* HTML */ `
			<div class="w-64">
				<label class="text-sm font-medium">Meeting time</label>
				<hlm-time-input class="mt-1" [value]="value" (valueChange)="value = $event" />
			</div>
		`,
	}),
};
