import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

@Component({
	selector: 'spartan-badge-colors-preview',
	imports: [HlmBadgeImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-full flex-wrap justify-center gap-2">
			<span hlmBadge class="dark:text-bg-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950">Blue</span>
			<span hlmBadge class="dark:text-bg-green-300 bg-green-50 text-green-700 dark:bg-green-950">Green</span>
			<span hlmBadge class="dark:text-bg-sky-300 bg-sky-50 text-sky-700 dark:bg-sky-950">Sky</span>
			<span hlmBadge class="dark:text-bg-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-950">Purple</span>
			<span hlmBadge class="dark:text-bg-red-300 bg-red-50 text-red-700 dark:bg-red-950">Red</span>
		</div>
	`,
})
export class BadgeColorsPreview {}
