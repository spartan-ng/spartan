import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDatePicker, HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmDatePicker<Date>> = {
	title: 'Date Picker',
	component: HlmDatePicker,
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
			<hlm-date-picker [min]="min" [max]="max" [captionLayout]="captionLayout">
                <hlm-date-picker-trigger buttonId="date">Pick a date</hlm-date-picker-trigger>
            </hlm-date-picker>
		</div>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmDatePicker<Date>>;

const pad = (value: number): string => String(value).padStart(2, '0');

/** Display format (shown on blur / in the trigger) - intentionally distinct from the edit format. */
const formatDate = (date: Date): string => date.toDateString();

/** Edit format (shown while focused) - `dd/MM/yyyy`. */
const formatInputDate = (date: Date): string =>
	`${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

/** Parses `dd/MM/yyyy` back into a `Date`. Does not understand the display format on purpose. */
const parseDate = (value: string): Date | undefined => {
	const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (!match) return undefined;
	const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
	return isNaN(date.getTime()) ? undefined : date;
};

export const Default: Story = {
	args: { min: new Date(2020, 4, 1), max: new Date(2030, 6, 1), captionLayout: 'label' },
};

export const Input: Story = {
	render: () => ({
		props: { formatDate, formatInputDate, parseDate },
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-date-picker [formatDate]="formatDate">
				<hlm-date-picker-input
					inputId="date-input"
					placeholder="dd/MM/yyyy"
					[parseDate]="parseDate"
					[formatInputDate]="formatInputDate"
				/>
				<hlm-date-picker-trigger buttonId="date-trigger" [showTrigger]="false">unset</hlm-date-picker-trigger>
			</hlm-date-picker>
		</div>
		`,
	}),
};

export const WithHintAndError: Story = {
	render: (args) => ({
		props: {
			...args,
			form: new FormGroup({
				date: new FormControl(null, { validators: [Validators.required] }),
			}),
		},
		template: `
		<form [formGroup]="form" class="space-y-3 w-full max-w-sm">

			<div hlmField>
				<label hlmFieldLabel>Date *</label>
				<hlm-date-picker
					formControlName="date"
					[captionLayout]="captionLayout"
					[min]="min"
					[max]="max">
					<hlm-date-picker-trigger buttonId="date">Select a date</hlm-date-picker-trigger>
				</hlm-date-picker>

				<p hlmFieldDescription>Pick a date for the event so we can reserve the room.</p>

				<hlm-field-error>Select a date to continue.</hlm-field-error>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
				<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
			</div>
		</form>
		`,
	}),
};
