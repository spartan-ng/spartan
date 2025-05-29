import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';

import { FormsModule } from '@angular/forms';
import { BrnSwitchComponent, BrnSwitchImports } from '@spartan-ng/brain/switch';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { HlmSwitchComponent, HlmSwitchImports } from '@spartan-ng/helm/switch';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'hlm-switch-ng-model',
	template: `
		<!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
		<label class="flex items-center" hlmLabel>
			test switch
			<hlm-switch [(ngModel)]="switchValue" id="testSwitchForm" (changed)="handleChange($event)" />
		</label>

		<p data-testid="switchValue">{{ switchValue }}</p>
		<p data-testid="changedValue">{{ changedValueTo }}</p>
	`,
	imports: [HlmSwitchComponent, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchFormComponent {
	@Input()
	public switchValue = false;

	protected changedValueTo: boolean | undefined;

	handleChange(value: boolean) {
		this.changedValueTo = value;
	}
}

const meta: Meta<BrnSwitchComponent> = {
	title: 'Switch',
	component: BrnSwitchComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [BrnSwitchImports, HlmSwitchImports, HlmLabelDirective, SwitchFormComponent, FormsModule],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSwitchComponent>;

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

type FormStory = StoryObj<SwitchFormComponent>;
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
