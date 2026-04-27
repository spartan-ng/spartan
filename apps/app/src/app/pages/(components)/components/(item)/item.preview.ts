import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-preview',
	imports: [HlmItemImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideBadgeCheck, lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<hlm-item variant="outline">
			<hlm-item-content>
				<hlm-item-title>Basic Item</hlm-item-title>
				<p hlmItemDescription>A simple item with title and description.</p>
			</hlm-item-content>
			<hlm-item-actions>
				<button hlmBtn variant="outline" size="sm">Action</button>
			</hlm-item-actions>
		</hlm-item>
		<a hlmItem href="#" variant="outline" size="sm">
			<hlm-item-media>
				<ng-icon name="lucideBadgeCheck" class="text-[calc(var(--spacing)*5)]" />
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>Your profile has been verified.</hlm-item-title>
			</hlm-item-content>
			<hlm-item-actions>
				<ng-icon name="lucideChevronRight" class="text-[calc(var(--spacing)*4)]" />
			</hlm-item-actions>
		</a>
	`,
})
export class ItemPreview {}

export const defaultImports = `import { HlmItemImports } from '@spartan-ng/helm/item';`;

export const defaultSkeleton = `
<hlm-item>
  <hlm-item-media variant="icon">
    <ng-icon name="lucideBadgeCheck" />
  </hlm-item-media>
  <hlm-item-content>
    <hlm-item-title>Title</hlm-item-title>
    <hlm-item-description>Description</hlm-item-description>
  </hlm-item-content>
  <hlm-item-actions>
    <button hlmBtn>Action</button>
  </hlm-item-actions>
</hlm-item>
`;

export const itemComposition = `
hlm-item-group
└── hlm-item
    ├── hlm-item-header
    ├── hlm-item-media
    ├── hlm-item-content
    │   ├── hlm-item-title
    │   └── hlm-item-description
    ├── hlm-item-actions
    └── hlm-item-footer
`;
