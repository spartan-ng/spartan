import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmCalendar<Date>> = {
	title: 'Calendar',
	component: HlmCalendar,
	tags: ['autodocs'],
	args: {},
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [HlmCalendar],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-calendar [(date)]="date" [min]="min" [max]="max" />
		</div>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmCalendar<Date>>;

export const Default: Story = {
	args: {
		date: new Date(2024, 5, 1),
		min: new Date(2024, 4, 1),
		max: new Date(2024, 6, 1),
	},
};
