import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta = {
	title: 'Message',
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmMessageImports, HlmBubbleImports, HlmAvatarImports, HlmMarkerImports],
		}),
	],
};

export default meta;
type Story = StoryObj;

export const Conversation: Story = {
	render: () => ({
		template: `
			<div class="flex w-full max-w-sm flex-col gap-6 p-4">
				<div hlmMessage align="end">
					<div hlmMessageAvatar>
						<hlm-avatar>
							<span hlmAvatarFallback>ME</span>
						</hlm-avatar>
					</div>
					<div hlmMessageContent>
						<div hlmBubble>
							<div hlmBubbleContent>Deploying to prod real quick.</div>
						</div>
					</div>
				</div>
				<div hlmMessage>
					<div hlmMessageAvatar>
						<hlm-avatar>
							<span hlmAvatarFallback>R</span>
						</hlm-avatar>
					</div>
					<div hlmMessageContent>
						<div hlmBubble variant="muted">
							<div hlmBubbleContent>It's 4:55 PM. On a Friday.</div>
						</div>
					</div>
				</div>
				<div hlmMessage align="end">
					<div hlmMessageAvatar>
						<hlm-avatar>
							<span hlmAvatarFallback>ME</span>
						</hlm-avatar>
					</div>
					<div hlmMessageContent>
						<div hlmBubble>
							<div hlmBubbleContent>It's a one-line change.</div>
						</div>
						<div hlmMessageFooter>Delivered</div>
					</div>
				</div>
				<div hlmMessage>
					<div hlmMessageAvatar>
						<hlm-avatar>
							<span hlmAvatarFallback>R</span>
						</hlm-avatar>
					</div>
					<div hlmMessageContent>
						<div hlmBubbleGroup>
							<div hlmBubble variant="muted">
								<div hlmBubbleContent>It's always a one-line change 😭.</div>
							</div>
							<div hlmBubble variant="muted">
								<div hlmBubbleContent>Alright, let me take a look.</div>
								<div hlmBubbleReactions aria-label="Reactions: thumbs up">
									<span>👍</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div hlmMarker role="status">
					<span hlmMarkerContent class="shimmer">
						<span class="font-medium">Oliver</span> is typing...
					</span>
				</div>
			</div>
		`,
	}),
};
