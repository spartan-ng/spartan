import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';

import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnSwitch, BrnSwitchImports } from '@spartan-ng/brain/switch';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSwitch, HlmSwitchImports } from '@spartan-ng/helm/switch';

import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'hlm-switch-ng-model',
	template: `
		<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
		<label class="flex items-center" hlmLabel>
			test switch
			<hlm-switch [(ngModel)]="switchValue" id="testSwitchForm" (checkedChange)="handleChange($event)" />
		</label>

		<p data-testid="switchValue">{{ switchValue }}</p>
		<p data-testid="changedValue">{{ changedValueTo }}</p>
	`,
	imports: [HlmSwitch, FormsModule, HlmLabel],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchForm {
	@Input()
	public switchValue = false;

	protected changedValueTo: boolean | undefined;

	handleChange(value: boolean) {
		this.changedValueTo = value;
	}
}

@Component({
	selector: 'switch-hint-error-story',
	imports: [HlmSwitch, HlmFieldImports, HlmButton, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form" class="w-full max-w-sm">
			<hlm-field-group>
				<hlm-field>
					<label id="test-switch-label" hlmFieldLabel>Test Switch</label>
					<hlm-switch formControlName="test" class="ml-2" id="test-switch-label-with-aria" />
					<p hlmFieldDescription>This is a test switch.</p>

					<hlm-field-error>Test switch must be enabled.</hlm-field-error>
				</hlm-field>

				<hlm-field orientation="horizontal">
					<button hlmBtn type="button" (click)="form.markAllAsTouched()">Validate</button>
					<button hlmBtn variant="outline" type="button" (click)="form.reset()">Reset</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
class SwitchHintErrorStory {
	private readonly _fb = inject(FormBuilder);
	public readonly form = this._fb.group({ test: [false, Validators.requiredTrue] });
}

const meta: Meta<BrnSwitch> = {
	title: 'Switch',
	component: BrnSwitch,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [BrnSwitchImports, HlmSwitchImports, HlmLabel, SwitchForm, SwitchHintErrorStory, FormsModule],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSwitch>;

export const Default: Story = {
	render: () => ({
		template: `
       <hlm-switch id='testSwitchDefault' aria-label='test switch' />
    `,
	}),
};

export const InsideLabel: Story = {
	render: () => ({
		template: `
      <label class='flex items-center' hlmLabel> Test Switch
        <hlm-switch class='ml-2' id='testSwitchInsideLabel' />
      </label>
    `,
	}),
};

export const LabeledWithAriaLabeledBy: Story = {
	render: () => ({
		template: `
      <div class='flex items-center'>
        <label id='testSwitchLabel' for='testSwitchLabeledWithAria' hlmLabel> Test Switch </label>
        <hlm-switch class='ml-2' id='testSwitchLabeledWithAria' aria-labelledby='testSwitchLabel' />
      </div>
    `,
	}),
};

export const Disabled: Story = {
	render: () => ({
		template: `
      <div class='flex items-center'>
         <label id='testSwitchLabel' for='testSwitchDisabled' hlmLabel> Disabled Switch </label>
       <hlm-switch  disabled="true" class='ml-2' id='testSwitchDisabled' aria-labelledby='testSwitchLabel' />
      </div>
    `,
	}),
};

type FormStory = StoryObj<SwitchForm>;
export const Form: FormStory = {
	render: () => ({
		template: `
    <hlm-switch-ng-model />
    `,
	}),
};

export const FormTrue: FormStory = {
	args: {
		switchValue: true,
	},
	render: ({ ...args }) => ({
		props: args,
		template: `
    <hlm-switch-ng-model  ${argsToTemplate(args)} />
    `,
	}),
};

export const WithHintAndError: Story = {
	render: () => ({
		template: '<switch-hint-error-story />',
	}),
};
