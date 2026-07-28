import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode, lucideX } from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-attachment-preview',
	imports: [HlmAttachmentImports, HlmSpinner, NgIcon],
	providers: [provideIcons({ lucideFileCode, lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-3 py-12',
	},
	template: `
		<div hlmAttachmentGroup>
			@for (image of _images; track image.name) {
				<div hlmAttachment orientation="vertical">
					<div hlmAttachmentMedia variant="image">
						<img [src]="image.src" [alt]="image.alt" />
					</div>
					<div hlmAttachmentContent>
						<span hlmAttachmentTitle>{{ image.name }}</span>
						<span hlmAttachmentDescription>{{ image.meta }}</span>
					</div>
				</div>
			}
		</div>

		<div hlmAttachment state="uploading" class="w-full">
			<div hlmAttachmentMedia>
				<hlm-spinner />
			</div>
			<div hlmAttachmentContent>
				<span hlmAttachmentTitle>sales-dashboard.pdf</span>
				<span hlmAttachmentDescription>Uploading · 64%</span>
			</div>
			<div hlmAttachmentActions>
				<button hlmAttachmentAction aria-label="Cancel upload">
					<ng-icon name="lucideX" />
				</button>
			</div>
		</div>

		<div hlmAttachment class="w-full">
			<div hlmAttachmentMedia>
				<ng-icon name="lucideFileCode" />
			</div>
			<div hlmAttachmentContent>
				<span hlmAttachmentTitle>message-renderer.tsx</span>
				<span hlmAttachmentDescription>TypeScript · 12 KB</span>
			</div>
			<div hlmAttachmentActions>
				<button hlmAttachmentAction aria-label="Remove message-renderer.tsx">
					<ng-icon name="lucideX" />
				</button>
			</div>
		</div>
	`,
})
export class AttachmentPreview {
	protected readonly _images = [
		{
			name: 'workspace.png',
			meta: 'PNG · 820 KB',
			src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80',
			alt: 'Workspace',
		},
		{
			name: 'desk-reference.jpg',
			meta: 'JPG · 1.1 MB',
			src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80',
			alt: 'Desk',
		},
		{
			name: 'office-reference.jpg',
			meta: 'JPG · 940 KB',
			src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80',
			alt: 'Office',
		},
	];
}

export const defaultImports = `
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
`;

export const defaultSkeleton = `
<div hlmAttachment>
  <div hlmAttachmentMedia>
    <ng-icon name="lucideFileCode" />
  </div>
  <div hlmAttachmentContent>
    <span hlmAttachmentTitle>report.pdf</span>
    <span hlmAttachmentDescription>PDF · 1.2 MB</span>
  </div>
</div>
`;
