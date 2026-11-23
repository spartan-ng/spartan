import { HlmStreamText, HlmStreamTextImports } from '@spartan-ng/helm/stream-text';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Stream Text',
	component: HlmStreamText,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmStreamTextImports],
		}),
	],
} as Meta<HlmStreamText>;

type Story = StoryObj<HlmStreamText>;

export const StreamingWithCursor: Story = {
	render: () => ({
		template: `
			<div class="max-w-lg p-4 border rounded-xl">
				<hlm-stream-text
					[content]="'Thinking through the query and analyzing data records...'"
					[streaming]="true"
				/>
			</div>
		`,
	}),
};

export const Complete: Story = {
	render: () => ({
		template: `
			<div class="max-w-lg p-4 border rounded-xl">
				<hlm-stream-text
					[content]="'The operation completed successfully with 0 errors.'"
					[streaming]="false"
				/>
			</div>
		`,
	}),
};
