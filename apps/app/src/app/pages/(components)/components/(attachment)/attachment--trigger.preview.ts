import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideFileSearch, lucideX } from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

@Component({
	selector: 'spartan-attachment-trigger-preview',
	imports: [HlmAttachmentImports, HlmDialogImports, NgIcon],
	providers: [provideIcons({ lucideFileSearch, lucideCopy, lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-sm py-12',
	},
	template: `
		<hlm-dialog>
			<div hlmAttachment class="w-full">
				<div hlmAttachmentMedia>
					<ng-icon name="lucideFileSearch" />
				</div>
				<div hlmAttachmentContent>
					<span hlmAttachmentTitle>research-summary.pdf</span>
					<span hlmAttachmentDescription>Open preview dialog</span>
				</div>
				<div hlmAttachmentActions>
					<button hlmAttachmentAction aria-label="Copy link">
						<ng-icon name="lucideCopy" />
					</button>
					<button hlmAttachmentAction aria-label="Remove research-summary.pdf">
						<ng-icon name="lucideX" />
					</button>
				</div>
				<button hlmAttachmentTrigger hlmDialogTrigger aria-label="Preview research-summary.pdf"></button>
			</div>
			<hlm-dialog-content *hlmDialogPortal="let ctx" class="sm:max-w-md">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>research-summary.pdf</h3>
					<p hlmDialogDescription>
						The attachment trigger fills the card and opens the dialog, while the actions stay independently clickable
						above it.
					</p>
				</hlm-dialog-header>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class AttachmentTriggerPreview {}
