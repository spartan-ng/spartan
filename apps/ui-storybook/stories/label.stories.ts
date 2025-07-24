import { FormsModule } from '@angular/forms';
import { BrnLabel } from '@spartan-ng/brain/label';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<{}> = {
	title: 'Label',
	component: HlmLabel,
	tags: ['autodocs'],
	args: {
		variant: 'default',
		error: 'auto',
	},
	argTypes: {
		variant: {
			options: ['default'],
			control: {
				type: 'select',
			},
		},
		error: {
			options: ['auto', 'true'],
			control: {
				type: 'select',
			},
		},
		id: {
			control: 'text',
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmInput, HlmLabel, BrnLabel, FormsModule],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmLabel>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <label hlmLabel ${argsToTemplate(args)}>E-Mail
        <input class='w-80' hlmInput  type='email' placeholder='Email'/>
    </label>
    `,
	}),
};

export const InputRequired: Story = {
	render: ({ ...args }) => ({
		props: { ...args, value: '' },
		template: `
    <label hlmLabel ${argsToTemplate(args)}>E-Mail *
        <input [(ngModel)]="value" class='w-80' hlmInput  type='email' placeholder='Email *' required/>
    </label>
    `,
	}),
};
