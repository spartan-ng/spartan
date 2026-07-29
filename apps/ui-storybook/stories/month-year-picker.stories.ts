import { ReactiveFormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDatePickerImports, HlmMonthYearPicker } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

const meta: Meta<HlmMonthYearPicker<Date>> = {
	title: 'Month Year Picker',
	component: HlmMonthYearPicker,
	tags: ['autodocs'],
	args: {
		minDate: new Date(2020, 4, 1),
		maxDate: new Date(2030, 6, 1),
	},
	decorators: [
		moduleMetadata({
			imports: [HlmDatePickerImports, ReactiveFormsModule, HlmFieldImports, HlmButton],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-month-year-picker [minDate]="minDate" [maxDate]="maxDate">
				<hlm-date-picker-trigger buttonId="date">Pick a year and month</hlm-date-picker-trigger>
			</hlm-month-year-picker>
		</div>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmMonthYearPicker<Date>>;

const pad = (value: number): string => String(value).padStart(2, '0');

/** Display format (shown on blur / in the trigger) - `MM.yyyy`, distinct from the edit format. */
const formatDate = (date: Date): string => `${pad(date.getMonth() + 1)}.${date.getFullYear()}`;

/** Edit format (shown while focused) - `MM/yyyy`. */
const formatInputDate = (date: Date): string => `${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

/** Parses `MM/yyyy`. Does not understand the display format on purpose. */
const parseDate = (value: string): Date | null => {
	const match = value.match(/^(\d{2})\/(\d{4})$/);
	if (!match) return null;
	const month = Number(match[1]);
	if (month < 1 || month > 12) return null;
	return new Date(Number(match[2]), month - 1, 1);
};

export const Default: Story = {
	args: { minDate: new Date(2020, 4, 1), maxDate: new Date(2030, 6, 1) },
};

export const Input: Story = {
	render: () => ({
		props: { formatDate, formatInputDate, parseDate },
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-month-year-picker [formatDate]="formatDate">
				<hlm-month-year-input
					inputId="date-input"
					placeholder="MM/yyyy"
					[parseDate]="parseDate"
					[formatInputDate]="formatInputDate"
				/>
				<hlm-date-picker-trigger buttonId="date-trigger" [showTrigger]="false">unset</hlm-date-picker-trigger>
			</hlm-month-year-picker>
		</div>
		`,
	}),
};
