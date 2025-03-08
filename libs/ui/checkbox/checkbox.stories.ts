import { NgIcon } from '@ng-icons/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HlmButtonModule } from '../button/helm/src';
import { HlmIconDirective } from '../icon/helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { HlmCheckboxComponent, HlmCheckboxImports } from './helm/src';

@Component({
	selector: 'hlm-checkbox-component-tester',
	template: `
		<div class="flex items-center gap-4" [formGroup]="form">
			<label id="checkbox-label" for="testCheckboxDis1" hlmLabel>
				Test Disabled Checkbox with Reactive Forms
				<hlm-checkbox class="ml-2" id="testCheckboxDis1" aria-labelledby="testCheckbox" formControlName="checkbox" />
			</label>

			<button hlmBtn type="button" role="button" (click)="enableOrDisableCheckbox()">Enable or disable button</button>
		</div>
	`,
})
class HlmCheckboxComponentTester {
	form = inject(FormBuilder).group({
		checkbox: [false],
	});

	enableOrDisableCheckbox(): void {
		this.form.enabled ? this.form.disable() : this.form.enable();
	}
}

const meta: Meta<HlmCheckboxComponent> = {
	title: 'Checkbox',
	component: HlmCheckboxComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [
				HlmCheckboxImports,
				HlmLabelDirective,
				NgIcon,
				HlmIconDirective,
				ReactiveFormsModule,
				HlmButtonModule,
				HlmCheckboxComponentTester,
			],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmCheckboxComponent>;

export const Default: Story = {
	render: () => ({
		template: /* HTML */ `
			<label id="checkbox-label" class="" hlmLabel>
				Test Checkbox
				<hlm-checkbox id="testCheckbox" aria-checked="mixed" aria-label="test checkbox" />
			</label>
		`,
	}),
};

export const InsideLabel: Story = {
	render: () => ({
		template: /* HTML */ `
			<label id="checkbox-label" class="flex items-center" hlmLabel>
				Test Checkbox
				<hlm-checkbox class="ml-2" id="testCheckbox" />
			</label>
		`,
	}),
};

export const LabeledWithAriaLabeledBy: Story = {
	render: () => ({
		template: /* HTML */ `
			<div id="checkbox-label" class="flex items-center">
				<label id="testCheckbox" for="testCheckboxAria" hlmLabel>Test Checkbox</label>
				<hlm-checkbox class="ml-2" id="testCheckboxAria" aria-labelledby="testCheckbox" />
			</div>
		`,
	}),
};

export const disabled: Story = {
	render: () => ({
		template: /* HTML */ `
			<div class="flex items-center">
				<label id="checkbox-label" for="testCheckboxDis1" hlmLabel>Test Checkbox</label>
				<hlm-checkbox disabled class="ml-2" id="testCheckboxDis1" aria-labelledby="testCheckbox" />
			</div>

			<div class="flex items-center pt-4">
				<hlm-checkbox disabled id="testCheckboxDis2" />
				<label class="ml-2" for="testCheckboxDis2" hlmLabel>Test Checkbox 2</label>
			</div>

			<div class="flex items-center pt-4">
				<hlm-checkbox id="testCheckboxDis3" />
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

export const indeterminate: Story = {
	render: () => ({
		template: /* HTML */ `
			<div id="checkbox-label" class="flex items-center">
				<label id="testCheckbox" for="testCheckboxIndeterminate" hlmLabel>Test Checkbox</label>
				<hlm-checkbox
					checked="indeterminate"
					class="ml-2"
					id="testCheckboxIndeterminate"
					aria-labelledby="testCheckbox"
				/>
			</div>
		`,
	}),
};
