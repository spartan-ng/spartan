import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode, lucideFileText, lucideTable, lucideX } from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';

@Component({
	selector: 'spartan-attachment-group-preview',
	imports: [HlmAttachmentImports, NgIcon],
	providers: [provideIcons({ lucideFileText, lucideTable, lucideFileCode, lucideX })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block w-full min-w-0',
	},
	template: `
		<div class="mx-auto w-full max-w-sm py-12">
			<div hlmAttachmentGroup class="w-full">
				@for (item of _items; track item.name) {
					<div hlmAttachment class="w-64">
						@if (item.src) {
							<div hlmAttachmentMedia variant="image">
								<img [src]="item.src" [alt]="item.name" />
							</div>
						} @else if (item.icon) {
							<div hlmAttachmentMedia>
								<ng-icon [name]="item.icon" />
							</div>
						}
						<div hlmAttachmentContent>
							<span hlmAttachmentTitle>{{ item.name }}</span>
							<span hlmAttachmentDescription>{{ item.meta }}</span>
						</div>
						<div hlmAttachmentActions>
							<button hlmAttachmentAction [attr.aria-label]="'Remove ' + item.name">
								<ng-icon name="lucideX" />
							</button>
						</div>
					</div>
				}
			</div>
		</div>
	`,
})
export class AttachmentGroupPreview {
	protected readonly _items = [
		{ name: 'briefing-notes.pdf', meta: 'PDF · 1.4 MB', icon: 'lucideFileText' as const },
		{
			name: 'workspace.png',
			meta: 'PNG · 820 KB',
			src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80',
		},
		{ name: 'customers.csv', meta: 'CSV · 18 KB', icon: 'lucideTable' as const },
		{ name: 'renderer.tsx', meta: 'TSX · 12 KB', icon: 'lucideFileCode' as const },
	];
}
