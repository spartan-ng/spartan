import { ApplicationRef, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmDatePicker<Date>> = {
	title: 'Date Picker',
	component: HlmDatePicker,
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
			imports: [HlmDatePicker],
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

@Component({
	selector: 'date-picker-form-story',
	standalone: true,
	imports: [ReactiveFormsModule, HlmLabelImports, HlmFormFieldImports, HlmDatePicker],
	template: `
		<div class="space-y-8 max-w-md">
			<hlm-form-field>
				<label hlmLabel>Birth Date</label>
				<hlm-date-picker
					[formControl]="birthDate"
					[min]="minDate"
					[max]="maxDate"
					captionLayout="dropdown"
				>
					<span>Pick your birth date</span>
				</hlm-date-picker>
				<hlm-hint>Select the date you were born</hlm-hint>
				<hlm-error>Birth date is required</hlm-error>
			</hlm-form-field>

			<hlm-form-field>
				<label hlmLabel>Appointment Date</label>
				<hlm-date-picker [formControl]="appointmentDate" [min]="today" [max]="maxAppointmentDate" captionLayout="label">
					<span>Pick an appointment date</span>
				</hlm-date-picker>
				<hlm-hint>Choose a date for your appointment</hlm-hint>
				<hlm-error>Please select a valid appointment date</hlm-error>
			</hlm-form-field>

			<hlm-form-field>
				<label hlmLabel>Project Deadline (Optional)</label>
				<hlm-date-picker [formControl]="deadline" [min]="today" captionLayout="dropdown-months">
					<span>Pick a deadline</span>
				</hlm-date-picker>
				<hlm-hint>Optional: Set a deadline for your project</hlm-hint>
				<hlm-error>Deadline must be a future date</hlm-error>
			</hlm-form-field>

			<div class="flex gap-2 pt-4 border-t">
				<button
					class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
					(click)="markAllAsTouched()"
				>
					Validate Form
				</button>
				<button
					class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
					(click)="resetForm()"
				>
					Reset
				</button>
			</div>

			<div class="p-4 rounded-md bg-muted">
				<h3 class="text-sm font-semibold mb-2">Form Values:</h3>
				<pre class="text-xs">{{ getFormValues() }}</pre>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class DatePickerFormStory {
	private readonly _appRef = inject(ApplicationRef);

	public readonly today = new Date();
	public readonly minDate = new Date(1900, 0, 1);
	public readonly maxDate = new Date();
	public readonly maxAppointmentDate = new Date(this.today.getFullYear() + 1, 11, 31);

	public readonly birthDate = new FormControl<Date | null>(null, Validators.required);
	public readonly appointmentDate = new FormControl<Date | null>(null, Validators.required);
	public readonly deadline = new FormControl<Date | null>(null);

	markAllAsTouched() {
		this.birthDate.markAsTouched();
		this.appointmentDate.markAsTouched();
		this.deadline.markAsTouched();
		// Trigger a full application-wide change detection cycle
		this._appRef.tick();
	}

	resetForm() {
		this.birthDate.reset();
		this.appointmentDate.reset();
		this.deadline.reset();
	}

	getFormValues() {
		return JSON.stringify(
			{
				birthDate: this.birthDate.value?.toLocaleDateString() || null,
				appointmentDate: this.appointmentDate.value?.toLocaleDateString() || null,
				deadline: this.deadline.value?.toLocaleDateString() || null,
				valid: this.birthDate.valid && this.appointmentDate.valid,
			},
			null,
			2,
		);
	}
}

export const FormField: Story = {
	decorators: [
		moduleMetadata({
			imports: [DatePickerFormStory],
		}),
	],
	render: () => ({
		template: '<date-picker-form-story />',
	}),
};
