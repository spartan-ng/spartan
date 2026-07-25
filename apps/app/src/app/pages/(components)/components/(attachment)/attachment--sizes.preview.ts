import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileText } from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';

@Component({
	selector: 'spartan-attachment-sizes-preview',
	imports: [HlmAttachmentImports, NgIcon],
	providers: [provideIcons({ lucideFileText })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-3 py-12',
	},
	template: `
		<div hlmAttachment size="default" class="w-full">
			<div hlmAttachmentMedia>
				<ng-icon name="lucideFileText" />
			</div>
			<div hlmAttachmentContent>
				<span hlmAttachmentTitle>Default attachment</span>
				<span hlmAttachmentDescription>PDF · 2.4 MB</span>
			</div>
		</div>
		<div hlmAttachment size="sm" class="w-full">
			<div hlmAttachmentMedia>
				<ng-icon name="lucideFileText" />
			</div>
			<div hlmAttachmentContent>
				<span hlmAttachmentTitle>Small attachment</span>
				<span hlmAttachmentDescription>PDF · 2.4 MB</span>
			</div>
		</div>
		<div hlmAttachment size="xs" class="w-full">
			<div hlmAttachmentMedia>
				<ng-icon name="lucideFileText" />
			</div>
			<div hlmAttachmentContent>
				<span hlmAttachmentTitle>Extra small attachment</span>
			</div>
		</div>
	`,
})
export class AttachmentSizesPreview {}
