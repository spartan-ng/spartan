import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta = {
	title: 'Bubble',
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmBubbleImports],
		}),
	],
};

export default meta;
type Story = StoryObj;

export const Demo: Story = {
	render: () => ({
		template: `
			<div class="flex w-full max-w-sm flex-col gap-8 p-4">
				<div hlmBubble align="end">
					<div hlmBubbleContent>Hey there! what's up?</div>
				</div>
				<div hlmBubbleGroup>
					<div hlmBubble variant="muted">
						<div hlmBubbleContent>Hey! Want to see chat bubbles?</div>
					</div>
					<div hlmBubble variant="muted">
						<div hlmBubbleContent>I can group messages, switch sides, and keep the whole thread easy to scan.</div>
						<div hlmBubbleReactions role="img" aria-label="Reaction: thumbs up">
							<span>👍</span>
						</div>
					</div>
				</div>
				<div hlmBubble align="end">
					<div hlmBubbleContent>Sure. Hit me with your best demo.</div>
				</div>
			</div>
		`,
	}),
};

export const Variants: Story = {
	render: () => ({
		template: `
			<div class="flex w-full max-w-sm flex-col gap-6 p-4">
				<div hlmBubble><div hlmBubbleContent>default</div></div>
				<div hlmBubble variant="secondary"><div hlmBubbleContent>secondary</div></div>
				<div hlmBubble variant="muted"><div hlmBubbleContent>muted</div></div>
				<div hlmBubble variant="tinted"><div hlmBubbleContent>tinted</div></div>
				<div hlmBubble variant="outline"><div hlmBubbleContent>outline</div></div>
				<div hlmBubble variant="ghost"><div hlmBubbleContent>ghost</div></div>
				<div hlmBubble variant="destructive"><div hlmBubbleContent>destructive</div></div>
			</div>
		`,
	}),
};
