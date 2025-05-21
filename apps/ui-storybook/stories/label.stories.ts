import { FormsModule } from '@angular/forms';
import { BrnLabelDirective } from '@spartan-ng/brain/label';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<{}> = {
	title: 'Label',
	component: HlmLabelDirective,
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
			imports: [HlmInputDirective, HlmLabelDirective, BrnLabelDirective, FormsModule],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmLabelDirective>;

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
