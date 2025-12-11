import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';

import { FormsModule } from '@angular/forms';
import { BrnSwitch, BrnSwitchImports } from '@spartan-ng/brain/switch';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSwitch, HlmSwitchImports } from '@spartan-ng/helm/switch';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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

const meta: Meta<BrnSwitch> = {
	title: 'Switch',
	component: BrnSwitch,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [BrnSwitchImports, HlmSwitchImports, HlmLabel, SwitchForm, FormsModule],
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
