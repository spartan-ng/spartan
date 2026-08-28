import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { HlmMessageScrollerImports } from '@spartan-ng/helm/message-scroller';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta = {
	title: 'Message Scroller',
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmMessageScrollerImports, HlmMessageImports, HlmBubbleImports, HlmAvatarImports],
		}),
	],
};

export default meta;
type Story = StoryObj;

const frameStart = `
			<div class="flex h-96 w-full max-w-md flex-col overflow-hidden rounded-xl border">
`;

const frameEnd = `
			</div>
`;

function turn(id: string, who: 'me' | 'ai', text: string, anchor = false) {
	const align = who === 'me' ? ' align="end"' : '';
	const variant = who === 'ai' ? ' variant="muted"' : '';
	const fallback = who === 'me' ? 'ME' : 'AI';
	const scrollAnchor = anchor ? ' scrollAnchor' : '';
	return `
								<div hlmMessageScrollerItem messageId="${id}"${scrollAnchor}>
									<div hlmMessage${align}>
										<div hlmMessageAvatar>
											<hlm-avatar>
												<span hlmAvatarFallback>${fallback}</span>
											</hlm-avatar>
										</div>
										<div hlmMessageContent>
											<div hlmBubble${variant}>
												<div hlmBubbleContent>${text}</div>
											</div>
										</div>
									</div>
								</div>`;
}

export const Default: Story = {
	render: () => ({
		template: `
${frameStart}
				<div hlmMessageScrollerProvider class="min-h-0 flex-1" autoScroll>
					<div hlmMessageScroller>
						<div hlmMessageScrollerViewport>
							<div hlmMessageScrollerContent class="p-4">
${turn('1', 'me', 'Deploying to prod real quick.', true)}
${turn('2', 'ai', "It's 4:55 PM. On a Friday. MessageScroller will keep this turn readable while new content streams in below.")}
${turn('3', 'me', "It's a one-line change.", true)}
${turn('4', 'ai', "It's always a one-line change.")}
							</div>
						</div>
						<button hlmMessageScrollerButton></button>
					</div>
				</div>
${frameEnd}
		`,
	}),
};

export const AutoScroll: Story = {
	render: () => ({
		template: `
${frameStart}
				<div hlmMessageScrollerProvider class="min-h-0 flex-1" autoScroll>
					<div hlmMessageScroller>
						<div hlmMessageScrollerViewport>
							<div hlmMessageScrollerContent class="p-4">
${turn('1', 'me', 'Can you summarize the last five commits?', true)}
${turn('2', 'ai', 'Sure — starting from the oldest.')}
${turn('3', 'ai', '1. Add message-scroller Brain entrypoint.')}
${turn('4', 'ai', '2. Wire Helm hostDirectives and registry CSS.')}
${turn('5', 'ai', '3. Register the CLI generator and MCP prompts.')}
${turn('6', 'ai', '4. Ship docs previews for anchoring and streaming.')}
${turn('7', 'ai', '5. Expand Storybook coverage for auto-scroll.')}
${turn('8', 'me', 'Perfect — keep following new replies.', true)}
${turn('9', 'ai', 'AutoScroll stays pinned to the end while you are already there. Scroll up to pause follow.')}
							</div>
						</div>
						<button hlmMessageScrollerButton></button>
					</div>
				</div>
${frameEnd}
		`,
	}),
};

export const ScrollAnchors: Story = {
	render: () => ({
		template: `
${frameStart}
				<div hlmMessageScrollerProvider class="min-h-0 flex-1">
					<div hlmMessageScroller>
						<div hlmMessageScrollerViewport>
							<div hlmMessageScrollerContent class="p-4">
${turn('1', 'me', 'First user turn — marked as a scroll anchor.', true)}
${turn('2', 'ai', 'Assistant reply under that turn.')}
${turn('3', 'me', 'Second user turn — also an anchor.', true)}
${turn('4', 'ai', 'Another reply. Jump commands can target either anchor messageId.')}
${turn('5', 'me', 'Third anchor near the bottom.', true)}
${turn('6', 'ai', 'Previous-item peek keeps context above the reading line when an anchor is selected.')}
							</div>
						</div>
						<button hlmMessageScrollerButton></button>
					</div>
				</div>
${frameEnd}
		`,
	}),
};

export const OpeningStart: Story = {
	render: () => ({
		template: `
${frameStart}
				<div hlmMessageScrollerProvider class="min-h-0 flex-1" defaultScrollPosition="start">
					<div hlmMessageScroller>
						<div hlmMessageScrollerViewport>
							<div hlmMessageScrollerContent class="p-4">
${turn('1', 'me', 'Opening at the start of a long transcript.', true)}
${turn('2', 'ai', 'Row one — you should land near the top on first paint.')}
${turn('3', 'ai', 'Row two.')}
${turn('4', 'ai', 'Row three.')}
${turn('5', 'ai', 'Row four.')}
${turn('6', 'ai', 'Row five.')}
${turn('7', 'ai', 'Row six.')}
${turn('8', 'ai', 'Row seven — scroll down for newer messages.')}
${turn('9', 'me', 'Still more history below.', true)}
${turn('10', 'ai', 'defaultScrollPosition="start" applies once on the first non-empty render.')}
							</div>
						</div>
						<button hlmMessageScrollerButton></button>
					</div>
				</div>
${frameEnd}
		`,
	}),
};
