import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnRadioGroup } from '@spartan-ng/brain/radio-group';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmCode, HlmSmall } from '@spartan-ng/helm/typography';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

@Component({
	selector: 'radio-group-example',
	imports: [HlmRadioGroupImports, FormsModule, HlmButton, HlmCode, HlmSmall, HlmLabel],
	template: `
		<small hlmSmall class="font-semibold">Choose a version</small>
		<hlm-radio-group class="font-mono text-sm font-medium" [(ngModel)]="version">
			<label class="flex items-center" hlmLabel>
				<hlm-radio value="16.1.4">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v16.1.4
			</label>
			<label class="flex items-center" hlmLabel>
				<hlm-radio value="16.0.0">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v16.0.0
			</label>
			<label class="flex items-center" hlmLabel>
				<hlm-radio value="15.8.0">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v15.8.0
			</label>
			<label class="flex items-center" hlmLabel data-testid="disabledLabel">
				<hlm-radio disabled value="15.2.0">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				v15.2.0
			</label>
		</hlm-radio-group>
		<div class="my-2 flex space-x-2">
			<button size="sm" hlmBtn variant="outline" (click)="version = '16.0.0'">Set to v16.0.0</button>
			<button size="sm" hlmBtn variant="outline" (click)="version = null">Reset</button>
		</div>
		<small hlmSmall class="mt-6 block font-semibold">
			Current Version:
			<code data-testid="currentVersion" hlmCode class="text-xs">{{ version ?? 'none' }}</code>
		</small>
	`,
})
class RadioGroupExample {
	version: string | null = '16.1.4';
}

@Component({
	selector: 'radio-group-reactive-form-tester',
	standalone: true,
	imports: [HlmRadioGroupImports, ReactiveFormsModule, HlmFieldImports, HlmButton, HlmLabel],
	template: `
		<form [formGroup]="form" class="max-w-lg space-y-3">
			<div hlmField [attr.data-invalid]="isInvalid() ? 'true' : null">
				<label hlmFieldLabel>Billing Frequency *</label>
				<hlm-radio-group formControlName="plan" class="text-sm font-medium">
					<div hlmField orientation="horizontal" class="items-center gap-3">
						<hlm-radio value="monthly">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel class="font-normal">Monthly - $9.99</label>
					</div>
					<div hlmField orientation="horizontal" class="items-center gap-3">
						<hlm-radio value="annual">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel class="font-normal">Annual - $99.99</label>
					</div>
					<div hlmField orientation="horizontal" class="items-center gap-3">
						<hlm-radio value="lifetime">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel class="font-normal">Lifetime - $299.99</label>
					</div>
				</hlm-radio-group>
				@if (isInvalid()) {
					<hlm-field-error>Choose a plan to continue.</hlm-field-error>
				}
			</div>

			<div class="flex flex-wrap gap-2">
				<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
				<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
			</div>
		</form>
	`,
})
class RadioGroupReactiveFormTester {
	public readonly form = inject(FormBuilder).group({
		plan: ['', Validators.required],
	});

	isInvalid() {
		const control = this.form.get('plan');
		return !!control && control.invalid && control.touched;
	}
}

@Component({
	selector: 'radio-group-hint-error-story',
	standalone: true,
	imports: [HlmRadioGroupImports, ReactiveFormsModule, HlmFieldImports, HlmButton, HlmLabel],
	template: `
		<form [formGroup]="form" class="max-w-lg space-y-3">
			<div hlmField [attr.data-invalid]="showError ? 'true' : null">
				<label hlmFieldLabel>Billing Frequency *</label>
				<hlm-radio-group formControlName="plan" class="text-sm font-medium">
					<div hlmField orientation="horizontal" class="items-center gap-3">
						<hlm-radio value="monthly">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel class="font-normal">Monthly - $9.99</label>
					</div>
					<div hlmField orientation="horizontal" class="items-center gap-3">
						<hlm-radio value="annual">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel class="font-normal">Annual - $99.99</label>
					</div>
					<div hlmField orientation="horizontal" class="items-center gap-3">
						<hlm-radio value="lifetime">
							<hlm-radio-indicator indicator />
						</hlm-radio>
						<label hlmLabel class="font-normal">Lifetime - $299.99</label>
					</div>
				</hlm-radio-group>
				<p hlmFieldDescription>Pick a plan to see the billing schedule.</p>
				@if (showError) {
					<hlm-field-error>Choose a plan to continue.</hlm-field-error>
				}
			</div>

			<div class="flex flex-wrap gap-2">
				<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
				<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
			</div>
		</form>
	`,
})
class RadioGroupHintErrorStory {
	private readonly _fb = inject(FormBuilder);

	public readonly form = this._fb.group({
		plan: ['', Validators.required],
	});

	public get showError() {
		const control = this.form.get('plan');
		return !!control && control.invalid && (control.touched || control.dirty);
	}
}

const meta: Meta<BrnRadioGroup> = {
	title: 'Radio Group',
	component: BrnRadioGroup,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [
				RadioGroupExample,
				RadioGroupReactiveFormTester,
				RadioGroupHintErrorStory,
				HlmRadioGroupImports,
				HlmFieldImports,
				FormsModule,
				ReactiveFormsModule,
				HlmButton,
				HlmCode,
				HlmSmall,
				HlmLabel,
			],
			providers: [],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnRadioGroup>;

export const Default: Story = {
	render: () => ({
		template: '<radio-group-example/>',
	}),
};

export const LabelFor: Story = {
	render: () => ({
		template: `
		<hlm-radio-group class="text-sm font-medium" >
			<div class="flex items-center gap-3">
				<hlm-radio value="default" id="default">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="default" >
					Default
				</label>
			</div>
			<div class="flex items-center gap-3">
				<hlm-radio value="comfortable" id="comfortable">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="comfortable" >
					Comfortable
				</label>
			</div>
			<div class="flex items-center gap-3">
				<hlm-radio value="compact" id="compact">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="compact" >
					Compact
				</label>
			</div>
			<div class="flex items-center gap-3">
				<hlm-radio class="peer group" disabled=true value="disabled" id="disabled">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="disabled" >
					Disabled
				</label>
			</div>
		</hlm-radio-group>
`,
	}),
};

export const Validation: Story = {
	name: 'Reactive Validation',
	render: () => ({
		template: `<radio-group-reactive-form-tester></radio-group-reactive-form-tester>`,
	}),
};

export const WithHintAndError: Story = {
	render: () => ({
		template: `<radio-group-hint-error-story></radio-group-hint-error-story>`,
	}),
};
