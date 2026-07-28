import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCheck,
	lucideClock,
	lucideFileText,
	lucideFileWarning,
	lucideRefreshCw,
	lucideX,
} from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-attachment-states-preview',
	imports: [HlmAttachmentImports, HlmSpinner, NgIcon],
	providers: [provideIcons({ lucideClock, lucideFileText, lucideFileWarning, lucideRefreshCw, lucideX, lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-2 py-12',
	},
	template: `
		<div hlmAttachment state="idle" class="w-full">
			<div hlmAttachmentMedia>
				<ng-icon name="lucideClock" />
			</div>
			<div hlmAttachmentContent>
				<span hlmAttachmentTitle>selected-file.pdf</span>
				<span hlmAttachmentDescription>Ready to upload</span>
			</div>
			<div hlmAttachmentActions>
				<button hlmAttachmentAction aria-label="Remove selected-file.pdf">
					<ng-icon name="lucideX" />
				</button>
			</div>
		</div>

		<div hlmAttachment state="uploading" class="w-full">
			<div hlmAttachmentMedia>
				<hlm-spinner />
			</div>
			<div hlmAttachmentContent>
				<span hlmAttachmentTitle>design-system.zip</span>
				<span hlmAttachmentDescription>Uploading · 64%</span>
			</div>
			<div hlmAttachmentActions>
				<button hlmAttachmentAction aria-label="Cancel upload">
					<ng-icon name="lucideX" />
				</button>
			</div>
		</div>

		<div hlmAttachment state="processing" class="w-full">
			<div hlmAttachmentMedia>
				<ng-icon name="lucideFileText" />
			</div>
			<div hlmAttachmentContent>
				<span hlmAttachmentTitle>market-research.pdf</span>
				<span hlmAttachmentDescription>Processing document</span>
			</div>
			<div hlmAttachmentActions>
				<button hlmAttachmentAction aria-label="Remove market-research.pdf">
					<ng-icon name="lucideX" />
				</button>
			</div>
		</div>

		<div hlmAttachment state="error" class="w-full">
			<div hlmAttachmentMedia>
				<ng-icon name="lucideFileWarning" />
			</div>
			<div hlmAttachmentContent>
				<span hlmAttachmentTitle>financial-model.xlsx</span>
				<span hlmAttachmentDescription>Upload failed. Try again.</span>
			</div>
			<div hlmAttachmentActions>
				<button hlmAttachmentAction aria-label="Retry upload">
					<ng-icon name="lucideRefreshCw" />
				</button>
				<button hlmAttachmentAction aria-label="Remove financial-model.xlsx">
					<ng-icon name="lucideX" />
				</button>
			</div>
		</div>

		<div hlmAttachment state="done" class="w-full">
			<div hlmAttachmentMedia>
				<ng-icon name="lucideCheck" />
			</div>
			<div hlmAttachmentContent>
				<span hlmAttachmentTitle>uploaded-report.pdf</span>
				<span hlmAttachmentDescription>Uploaded · 1.8 MB</span>
			</div>
			<div hlmAttachmentActions>
				<button hlmAttachmentAction aria-label="Remove uploaded-report.pdf">
					<ng-icon name="lucideX" />
				</button>
			</div>
		</div>
	`,
})
export class AttachmentStatesPreview {}
