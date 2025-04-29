import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';

import { FormsModule } from '@angular/forms';
import { BrnSwitchComponent, BrnSwitchImports } from '@spartan-ng/brain/switch';
import { HlmLabelDirective } from '../label/helm/src';
import { HlmSwitchImports } from './helm/src';
import { SwitchFormComponent } from './helm/src/lib/hlm-switch-ng-model.component.ignore.spec';

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
