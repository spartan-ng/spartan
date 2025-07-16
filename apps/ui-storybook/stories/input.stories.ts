import { FormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmInput> = {
	title: 'Input',
	component: HlmInput,
	tags: ['autodocs'],
	args: {
		error: 'auto',
	},
	argTypes: {
		error: {
			options: ['auto', 'true'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmInput, HlmLabel, HlmButton, FormsModule],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmInput>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <input aria-label='Email' class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email'/>
    `,
	}),
};

export const File: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <label hlmLabel for="picture">Picture</label>
      <input class='w-80' hlmInput ${argsToTemplate(args)} id="picture" type="file" />
    </div>`,
	}),
};

export const Disabled: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <input aria-label='Email' disabled class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email'/>
    `,
	}),
};

export const Required: Story = {
	render: ({ ...args }) => ({
		props: { value: '', ...args },
		template: `
    <input aria-label='Email *' [(ngModel)]="value" class='w-80' hlmInput ${argsToTemplate(args)} type='email' required placeholder='Email *'/>
    `,
	}),
};

export const Error: Story = {
	render: ({ ...args }) => ({
		props: { ...args, error: 'true' },
		template: `
    <input aria-label='Email' class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email' />
    `,
	}),
};

export const WithButton: Story = {
	name: 'With Button',
	render: ({ ...args }) => ({
		props: args,
		template: `
    <div class="flex items-center w-full max-w-sm space-x-2">
    <input aria-label='Email' class='w-80' hlmInput ${argsToTemplate(args)} type='email' placeholder='Email'/>
    <button hlmBtn>Subscribe</button>
    </div>
    `,
	}),
};
