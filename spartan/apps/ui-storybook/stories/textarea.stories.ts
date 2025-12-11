import { FormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';

export default {
	title: 'Textarea',
	component: HlmTextarea,
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
			imports: [HlmTextarea, HlmLabel, HlmButton, FormsModule],
		}),
	],
} as Meta<HlmTextarea>;

type Story = StoryObj<HlmTextarea>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
			<textarea hlmTextarea class="w-80" placeholder="Type your message here." ${argsToTemplate(args)}></textarea>
		`,
	}),
};

export const Disabled: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
			<textarea hlmTextarea disabled class="w-80" placeholder="Type your message here." ${argsToTemplate(args)}></textarea>
		`,
	}),
};

export const Required: Story = {
	render: ({ ...args }) => ({
		props: { value: '', ...args },
		template: `
			<textarea hlmTextarea required [(ngModel)]="value" class="w-80" placeholder="Type your message here.*" ${argsToTemplate(args)}></textarea>
		`,
	}),
};

export const Error: Story = {
	render: ({ ...args }) => ({
		props: { ...args, error: 'true' },
		template: `
			<textarea hlmTextarea class="w-80" placeholder="Type your message here.*" ${argsToTemplate(args)}></textarea>
		`,
	}),
};

export const WithButton: Story = {
	name: 'With Button',
	render: ({ ...args }) => ({
		props: args,
		template: `
			<div class="w-80 grid gap-2">
				<textarea hlmTextarea placeholder="Type your message here." ${argsToTemplate(args)}></textarea>
				<button hlmBtn>Subscribe</button>
			</div>
		`,
	}),
};
