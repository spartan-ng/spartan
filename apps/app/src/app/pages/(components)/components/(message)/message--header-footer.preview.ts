import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMessageImports } from '@spartan-ng/helm/message';

@Component({
	selector: 'spartan-message-header-footer-preview',
	imports: [HlmMessageImports, HlmBubbleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmMessage>
			<div hlmMessageContent>
				<div hlmMessageHeader>Olivia</div>
				<div hlmBubble variant="muted">
					<div hlmBubbleContent>I already checked the logs.</div>
				</div>
			</div>
		</div>

		<div hlmMessage align="end">
			<div hlmMessageContent>
				<div hlmBubble>
					<div hlmBubbleContent>Send the report to the team. Ping &#64;spartan if you need help.</div>
				</div>
				<div hlmMessageFooter>
					<div>
						Read
						<span class="font-normal">Yesterday</span>
					</div>
				</div>
			</div>
		</div>
	`,
})
export class MessageHeaderFooterPreview {}
