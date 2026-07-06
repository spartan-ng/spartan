import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDatePickerImports, HlmDateRangePicker } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmDateRangePicker<Date>> = {
	title: 'Date Range Picker',
	component: HlmDateRangePicker,
	tags: ['autodocs'],
	args: {
		captionLayout: 'label',
		min: new Date(2020, 4, 1),
		max: new Date(2030, 6, 1),
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
			imports: [HlmDatePickerImports, ReactiveFormsModule, HlmFieldImports, HlmButton],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-date-range-picker [min]="min" [max]="max" [captionLayout]="captionLayout">
                <hlm-date-picker-trigger buttonId="date">Pick a date</hlm-date-picker-trigger>
            </hlm-date-range-picker>
		</div>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmDateRangePicker<Date>>;

const pad = (value: number): string => String(value).padStart(2, '0');
const toInput = (date: Date): string => `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

/** Display format (shown on blur / in the trigger) - intentionally distinct from the edit format. */
const formatDates = (dates: [Date | undefined, Date | undefined]): string =>
	dates
		.filter((date): date is Date => !!date)
		.map((date) => date.toDateString())
		.join(' to ');

/** Edit format (shown while focused) - `dd/MM/yyyy - dd/MM/yyyy`. */
const formatInputDates = (dates: [Date | undefined, Date | undefined]): string =>
	dates
		.filter((date): date is Date => !!date)
		.map(toInput)
		.join(' - ');

/** Parses `dd/MM/yyyy - dd/MM/yyyy`. Does not understand the display format on purpose. */
const parseDate = (value: string): [Date, Date] | undefined => {
	const parts = value.split(' - ').map((part) => part.trim());
	if (parts.length !== 2) return undefined;

	const dates = parts.map((part) => {
		const match = part.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
		if (!match) return undefined;
		const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
		return isNaN(date.getTime()) ? undefined : date;
	});

	if (!dates[0] || !dates[1]) return undefined;
	return [dates[0], dates[1]];
};

export const Default: Story = {
	args: { min: new Date(2020, 4, 1), max: new Date(2030, 6, 1), captionLayout: 'label' },
};

export const Input: Story = {
	render: () => ({
		props: { formatDates, formatInputDates, parseDate },
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-date-range-picker [formatDates]="formatDates">
				<hlm-date-range-input
					inputId="date-input"
					placeholder="dd/MM/yyyy - dd/MM/yyyy"
					[parseDate]="parseDate"
					[formatInputDates]="formatInputDates"
				/>
				<hlm-date-picker-trigger buttonId="date-trigger" [showTrigger]="false">unset</hlm-date-picker-trigger>
			</hlm-date-range-picker>
		</div>
		`,
	}),
};

export const WithHintAndError: Story = {
	render: (args) => ({
		props: {
			...args,
			form: new FormGroup({
				dateRange: new FormControl(null, { validators: [Validators.required] }),
			}),
		},
		template: `
		<form [formGroup]="form" class="space-y-3 w-full max-w-sm">
			<div hlmField>
				<label hlmFieldLabel>Date Range *</label>
				<hlm-date-range-picker
					formControlName="dateRange"
					[captionLayout]="captionLayout"
					[min]="min"
					[max]="max">
					<hlm-date-picker-trigger buttonId="date">Select a date range</hlm-date-picker-trigger>
				</hlm-date-range-picker>

				<p hlmFieldDescription>Pick a start and end date for your booking.</p>

				<hlm-field-error>Select a date range to continue.</hlm-field-error>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
				<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
			</div>
		</form>
		`,
	}),
};
