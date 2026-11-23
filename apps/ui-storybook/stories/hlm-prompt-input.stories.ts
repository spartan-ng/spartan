import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideGlobe, lucidePaperclip, lucideSquare } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmPromptInput, HlmPromptInputImports } from '@spartan-ng/helm/prompt-input';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Prompt Input',
	component: HlmPromptInput,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmPromptInputImports, HlmButtonImports, NgIcon],
			providers: [provideIcons({ lucideArrowUp, lucidePaperclip, lucideGlobe, lucideSquare })],
		}),
	],
} as Meta<HlmPromptInput>;

type Story = StoryObj<HlmPromptInput>;

export const Default: Story = {
	render: () => ({
		template: `
			<div hlmPromptInput class="max-w-lg w-full">
				<textarea
					hlmPromptInputTextarea
					placeholder="Ask anything or prompt the AI agent..."
					[maxRows]="5"
				></textarea>

				<div hlmPromptInputActions class="flex items-center justify-between">
					<div class="flex items-center gap-1">
						<button hlmBtn size="icon-sm" variant="ghost" aria-label="Add attachments">
							<ng-icon name="lucidePaperclip" />
						</button>
						<button hlmBtn size="icon-sm" variant="ghost" aria-label="Search web">
							<ng-icon name="lucideGlobe" />
						</button>
					</div>

					<button
						hlmBtn
						hlmPromptInputSubmit
						size="icon-sm"
						variant="default"
						aria-label="Send prompt"
					>
						<ng-icon name="lucideArrowUp" />
					</button>
				</div>
			</div>
		`,
	}),
};

export const Disabled: Story = {
	render: () => ({
		template: `
			<div hlmPromptInput [disabled]="true" class="max-w-lg w-full">
				<textarea
					hlmPromptInputTextarea
					placeholder="Prompt input is disabled..."
				></textarea>

				<div hlmPromptInputActions class="flex items-center justify-between">
					<button hlmBtn size="icon-sm" variant="ghost" disabled>
						<ng-icon name="lucidePaperclip" />
					</button>
					<button hlmBtn size="icon-sm" variant="default" disabled>
						<ng-icon name="lucideArrowUp" />
					</button>
				</div>
			</div>
		`,
	}),
};
