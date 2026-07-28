import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMessageImports } from '@spartan-ng/helm/message';

@Component({
	selector: 'spartan-message-group-preview',
	imports: [HlmMessageImports, HlmBubbleImports, HlmAvatarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-6 py-12',
	},
	template: `
		<div hlmMessageGroup>
			<div hlmMessage>
				<div hlmMessageAvatar></div>
				<div hlmMessageContent>
					<div hlmBubble variant="muted">
						<div hlmBubbleContent>I checked the registry addresses.</div>
					</div>
				</div>
			</div>
			<div hlmMessage>
				<div hlmMessageAvatar>
					<hlm-avatar>
						<img hlmAvatarImage src="https://github.com/spartan-ng.png" alt="@spartan-ng" class="grayscale" />
						<span hlmAvatarFallback>CN</span>
					</hlm-avatar>
				</div>
				<div hlmMessageContent>
					<div hlmBubble variant="muted">
						<div hlmBubbleContent>The component and example JSON now live under the UI registry.</div>
					</div>
				</div>
			</div>
		</div>
	`,
})
export class MessageGroupPreview {}
