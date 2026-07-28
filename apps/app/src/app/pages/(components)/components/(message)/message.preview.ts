import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
import { HlmMessageImports } from '@spartan-ng/helm/message';

@Component({
	selector: 'spartan-message-preview',
	imports: [HlmMessageImports, HlmBubbleImports, HlmAvatarImports, HlmMarkerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-6 py-12',
	},
	template: `
		<div hlmMessage align="end">
			<div hlmMessageAvatar>
				<hlm-avatar>
					<img hlmAvatarImage src="/assets/avatar.png" alt="@me" class="grayscale" />
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
					<img hlmAvatarImage src="https://github.com/spartan-ng.png" alt="@spartan-ng" class="grayscale" />
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
					<img hlmAvatarImage src="/assets/avatar.png" alt="@me" class="grayscale" />
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
					<img hlmAvatarImage src="https://github.com/spartan-ng.png" alt="@spartan-ng" class="grayscale" />
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
				<span class="font-medium">Spartan</span>
				is typing...
			</span>
		</div>
	`,
})
export class MessagePreview {}

export const defaultImports = `
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
import { HlmMessageImports } from '@spartan-ng/helm/message';
`;

export const defaultSkeleton = `
<div hlmMessage>
  <div hlmMessageAvatar>
    <hlm-avatar>
      <img hlmAvatarImage src="/assets/avatar.png" alt="@spartan" />
      <span hlmAvatarFallback>SP</span>
    </hlm-avatar>
  </div>
  <div hlmMessageContent>
    <div hlmBubble>
      <div hlmBubbleContent>How can I help you today?</div>
    </div>
  </div>
</div>
`;
