import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { HlmDatePickerComponent } from './helm/src/lib/hlm-date-picker.component';

const meta: Meta<HlmDatePickerComponent<Date>> = {
	title: 'Date Picker',
	component: HlmDatePickerComponent,
	tags: ['autodocs'],
	args: {},
	argTypes: {},
	decorators: [
		moduleMetadata({
			imports: [HlmDatePickerComponent],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-date-picker [min]="min" [max]="max">
                <span>Pick a date</span>
            </hlm-date-picker>
		</div>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmDatePickerComponent<Date>>;

export const Default: Story = {
	args: { min: new Date(2020, 4, 1), max: new Date(2030, 6, 1) },
};
