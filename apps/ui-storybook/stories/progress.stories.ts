import { BrnProgress, BrnProgressImports } from '@spartan-ng/brain/progress';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<BrnProgress> = {
	title: 'Progress',
	component: BrnProgress,
	tags: ['autodocs'],
	args: {
		value: 30,
	},
	argTypes: {
		value: {
			control: { type: 'range', min: 0, max: 100, step: 2 },
		},
	},
	decorators: [
		moduleMetadata({
			imports: [BrnProgressImports, HlmProgressImports, HlmLabel],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnProgress>;

export const LoadingNotStarted: Story = {
	args: {
		value: 0,
	},
	render: ({ ...args }) => ({
		props: { ...args },
		template: `
    <h2 hlmLabel id='loading'>Loading (not started)</h2>
    <brn-progress class='mt-2 mb-8' aria-labelledby='loading' hlm ${argsToTemplate(args)}>
      <brn-progress-indicator hlm/>
    </brn-progress>
    `,
	}),
};

export const LoadingStarted: Story = {
	render: ({ ...args }) => ({
		props: { ...args },
		template: `
    <h2 hlmLabel id='loading'>Loading (started)</h2>
    <brn-progress class='mt-2 mb-8' aria-labelledby='loading started' hlm ${argsToTemplate(args)}>
      <brn-progress-indicator hlm/>
    </brn-progress>
    `,
	}),
};

export const Indeterminate: Story = {
	args: {
		value: null,
	},
	render: ({ ...args }) => ({
		props: args,
		template: `
    <h2 hlmLabel id='indeterminate'>Indeterminate</h2>
    <brn-progress class='mt-2 mb-8' aria-labelledby='indeterminate' hlm ${argsToTemplate(args)}>
      <brn-progress-indicator hlm/>
    </brn-progress>
    `,
	}),
};

export const Complete: Story = {
	args: {
		value: 100,
	},
	render: ({ ...args }) => ({
		props: args,
		template: `
    <h2 hlmLabel id='complete'>Complete</h2>
    <brn-progress class='mt-2 mb-8' aria-labelledby='complete' hlm ${argsToTemplate(args)}>
      <brn-progress-indicator hlm/>
    </brn-progress>
    `,
	}),
};
