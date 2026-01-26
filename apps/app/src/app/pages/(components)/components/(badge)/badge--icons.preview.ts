import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBookmark } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

@Component({
	selector: 'spartan-badge-icons-preview',
	imports: [HlmBadgeImports, NgIcon],
	providers: [provideIcons({ lucideBadgeCheck, lucideBookmark })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-full flex-wrap justify-center gap-2">
			<span hlmBadge variant="secondary">
				<ng-icon name="lucideBadgeCheck" />
				Verified
			</span>
			<span hlmBadge variant="outline">
				Bookmark
				<ng-icon name="lucideBookmark" />
			</span>
		</div>
	`,
})
export class BadgeIconsPreview {}
