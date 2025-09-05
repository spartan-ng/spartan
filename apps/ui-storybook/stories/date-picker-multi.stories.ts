import { HlmDatePickerMulti } from '@spartan-ng/helm/date-picker';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmDatePickerMulti<Date>> = {
	title: 'Date Picker Multi',
	component: HlmDatePickerMulti,
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
			imports: [HlmDatePickerMulti],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-date-picker-multi [min]="min" [max]="max" [captionLayout]="captionLayout">
                <span>Pick a date</span>
            </hlm-date-picker-multi>
		</div>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmDatePickerMulti<Date>>;

export const Default: Story = {
	args: { min: new Date(2020, 4, 1), max: new Date(2030, 6, 1), captionLayout: 'label' },
};
