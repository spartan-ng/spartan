import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
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
			imports: [HlmDatePicker, ReactiveFormsModule, HlmFieldImports, HlmButton],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
		<div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
			<hlm-date-picker [min]="min" [max]="max" [captionLayout]="captionLayout">
                <span>Pick a date</span>
            </hlm-date-picker>
		</div>
		`,
	}),
};

export default meta;

type Story = StoryObj<HlmDatePicker<Date>>;

export const Default: Story = {
	args: { min: new Date(2020, 4, 1), max: new Date(2030, 6, 1), captionLayout: 'label' },
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
			@let dateControl = form.get('date');
			@let showError = dateControl?.invalid && (dateControl?.touched || dateControl?.dirty);

			<div hlmField [attr.data-invalid]="showError ? 'true' : null">
				<label hlmFieldLabel for="date-hint">Date *</label>
				<hlm-date-picker
					id="date-hint"
					formControlName="date"
					[captionLayout]="captionLayout"
					[min]="min"
					[max]="max"
					hlmFieldControlDescribedBy>
					<span>Select a date</span>
				</hlm-date-picker>

				<p hlmFieldDescription>Pick a date for the event so we can reserve the room.</p>

				@if (showError) {
					<hlm-field-error>Select a date to continue.</hlm-field-error>
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
