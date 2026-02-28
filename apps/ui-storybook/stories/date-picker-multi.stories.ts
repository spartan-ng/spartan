import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDatePickerMulti } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmDatePickerMulti<Date>> = {
	title: 'Date Picker Multi',
	component: HlmDatePickerMulti,
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
			imports: [HlmDatePickerMulti, ReactiveFormsModule, HlmFieldImports, HlmButton],
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

export const WithHintAndError: Story = {
	render: (args) => ({
		props: {
			...args,
			form: new FormGroup({
				dates: new FormControl(null, { validators: [Validators.required] }),
			}),
		},
		template: `
		<form [formGroup]="form" class="space-y-3 w-full max-w-sm">
			@let datesControl = form.get('dates');
			@let showError = datesControl?.invalid && (datesControl?.touched || datesControl?.dirty);

			<div hlmField [attr.data-invalid]="showError ? 'true' : null">
				<label hlmFieldLabel for="dates-hint">Dates *</label>
				<hlm-date-picker-multi
					id="dates-hint"
					formControlName="dates"
					[captionLayout]="captionLayout"
					[min]="min"
					[max]="max"
					hlmFieldControlDescribedBy>
					<span>Select dates</span>
				</hlm-date-picker-multi>

				<p hlmFieldDescription>Select multiple dates for your availability.</p>

				@if (showError) {
					<hlm-field-error>Select at least one date to continue.</hlm-field-error>
				}
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
				<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
			</div>
		</form>
		`,
	}),
};
