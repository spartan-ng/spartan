import { HlmDatePickerMulti, HlmDateRangePicker } from '@spartan-ng/helm/date-picker';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmDateRangePicker<Date>> = {
	title: 'Date Range Picker',
	component: HlmDateRangePicker,
	tags: ['autodocs'],
	args: {
		captionLayout: 'label',
	},
	argTypes: {
		captionLayout: {
			options: ['dropdown', 'label', 'dropdown-months', 'dropdown-years'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmDateRangePicker, HlmDatePickerMulti],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-date-range-picker [min]="min" [max]="max" [captionLayout]="captionLayout">
                <span>Pick a date</span>
            </hlm-date-range-picker>
		</div>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmDateRangePicker<Date>>;

export const Default: Story = {
	args: { min: new Date(2020, 4, 1), max: new Date(2030, 6, 1), captionLayout: 'label' },
};
