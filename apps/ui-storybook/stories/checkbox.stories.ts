import { NgIcon } from '@ng-icons/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton, HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckbox, HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'hlm-checkbox-component-tester',
	imports: [HlmCheckboxImports, HlmButton, HlmLabel, ReactiveFormsModule, JsonPipe],
	template: `
		<form [formGroup]="form">
			<div class="flex items-center gap-4">
				<label id="checkbox-label" for="testCheckboxDis1" hlmLabel>
					Test Disabled Checkbox with Reactive Forms
					<hlm-checkbox
						class="ml-2"
						inputId="testCheckboxDis1"
						aria-labelledby="testCheckbox"
						formControlName="checkbox"
					/>
				</label>

				<button hlmBtn type="button" role="button" (click)="enableOrDisableCheckbox()">
					Enable or disable checkbox
				</button>
			</div>
		</form>
		{{ form.value | json }}
	`,
})
class HlmCheckboxTester {
	form = inject(FormBuilder).group({
		checkbox: [false],
	});

	enableOrDisableCheckbox(): void {
		this.form.enabled ? this.form.disable() : this.form.enable();
	}
}

@Component({
	selector: 'hlm-checkbox-hint-error-story',
	standalone: true,
	imports: [HlmCheckboxImports, HlmButtonImports, HlmFieldImports, ReactiveFormsModule],
	template: `
		<form [formGroup]="form" class="space-y-3">
			<div hlmField orientation="horizontal" class="items-start gap-2">
				<hlm-checkbox inputId="field-terms" formControlName="agreement" />
				<label hlmFieldLabel class="font-normal">I agree to the terms and conditions.</label>
				<hlm-field-error>You must accept the terms to continue.</hlm-field-error>
			</div>

			<div class="flex flex-wrap gap-2">
				<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
				<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
			</div>
		</form>
	`,
})
class CheckboxHintErrorStory {
	public readonly form = inject(FormBuilder).group({
		agreement: [false, Validators.requiredTrue],
	});
}

const meta: Meta<HlmCheckbox> = {
	title: 'Checkbox',
	component: HlmCheckbox,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [
				HlmCheckboxImports,
				HlmFieldImports,
				HlmLabel,
				NgIcon,
				HlmIcon,
				ReactiveFormsModule,
				HlmButtonImports,
				HlmCheckboxTester,
				CheckboxHintErrorStory,
			],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmCheckbox>;

export const Default: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-checkbox inputId="testCheckbox" aria-checked="mixed" aria-label="test checkbox" />
		`,
	}),
};

export const InsideLabel: Story = {
	render: () => ({
		template: /* HTML */ `
			<label id="checkbox-label" class="flex items-center" hlmLabel>
				Test Checkbox
				<hlm-checkbox class="ml-2" inputId="testCheckbox" />
			</label>
		`,
	}),
};

export const LabeledWithAriaLabeledBy: Story = {
	render: () => ({
		template: /* HTML */ `
			<div id="checkbox-label" class="flex items-center">
				<label id="testCheckbox" for="testCheckboxAria" hlmLabel>Test Checkbox</label>
				<hlm-checkbox class="ml-2" inputId="testCheckboxAria" aria-labelledby="testCheckbox" />
			</div>
		`,
	}),
};

export const Disabled: Story = {
	render: () => ({
		template: /* HTML */ `
			<div class="flex items-center">
				<label id="checkbox-label" for="testCheckboxDis1" hlmLabel>Test Checkbox</label>
				<hlm-checkbox disabled class="ml-2" inputId="testCheckboxDis1" aria-labelledby="testCheckbox" />
			</div>

			<div class="flex items-center pt-4">
				<hlm-checkbox disabled inputId="testCheckboxDis2" />
				<label class="ml-2" for="testCheckboxDis2" hlmLabel>Test Checkbox 2</label>
			</div>

			<div class="flex items-center pt-4">
				<hlm-checkbox inputId="testCheckboxDis3" />
				<label class="ml-2" for="testCheckboxDis3" hlmLabel>Test Checkbox 3 enabled</label>
			</div>
		`,
	}),
};

export const disabledWithForms: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-checkbox-component-tester />
		`,
	}),
};

export const Indeterminate: Story = {
	render: () => ({
		template: /* HTML */ `
			<div id="checkbox-label" class="flex items-center">
				<label id="testCheckbox" for="testCheckboxIndeterminate" hlmLabel>Test Checkbox</label>
				<hlm-checkbox
					indeterminate="true"
					class="ml-2"
					inputId="testCheckboxIndeterminate"
					aria-labelledby="testCheckbox"
				/>
			</div>
		`,
	}),
};

export const WithHintAndError: Story = {
	render: () => ({
		template: `<hlm-checkbox-hint-error-story />`,
	}),
};
