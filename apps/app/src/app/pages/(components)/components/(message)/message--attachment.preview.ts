import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileText } from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMessageImports } from '@spartan-ng/helm/message';

@Component({
	selector: 'spartan-message-attachment-preview',
	imports: [HlmMessageImports, HlmBubbleImports, HlmAttachmentImports, NgIcon],
	providers: [provideIcons({ lucideFileText, lucideDownload })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmMessage align="end">
			<div hlmMessageContent>
				<div hlmAttachment orientation="vertical">
					<div hlmAttachmentMedia variant="image">
						<img
							src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
							alt="Workspace"
						/>
					</div>
				</div>
				<div hlmBubble>
					<div hlmBubbleContent>Here's the image. Can you add it to the PDF? Use it for the cover page.</div>
				</div>
			</div>
		</div>

		<div hlmMessage>
			<div hlmMessageContent>
				<div hlmBubble variant="muted">
					<div hlmBubbleContent>Done. Here's the PDF with the image added as the cover page.</div>
				</div>
				<div hlmAttachment>
					<div hlmAttachmentMedia>
						<ng-icon name="lucideFileText" />
					</div>
					<div hlmAttachmentContent>
						<span hlmAttachmentTitle>sales-dashboard.pdf</span>
						<span hlmAttachmentDescription>PDF · 2.4 MB</span>
					</div>
					<div hlmAttachmentActions>
						<button
							hlmAttachmentAction
							type="button"
							title="Download"
							aria-label="Download"
							size="icon-sm"
							variant="secondary"
						>
							<ng-icon name="lucideDownload" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<div hlmMessage align="end">
			<div hlmMessageContent>
				<div hlmBubble>
					<div hlmBubbleContent>Thanks. Looks good.</div>
				</div>
			</div>
		</div>
	`,
})
export class MessageAttachmentPreview {}
