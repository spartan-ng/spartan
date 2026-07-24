import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

@Component({
	selector: 'spartan-badge-colors-preview',
	imports: [HlmBadgeImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-full flex-wrap justify-center gap-2">
			<span hlmBadge class="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Blue</span>
			<span hlmBadge class="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Green</span>
			<span hlmBadge class="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">Sky</span>
			<span hlmBadge class="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">Purple</span>
			<span hlmBadge class="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">Red</span>
		</div>
	`,
})
export class BadgeColorsPreview {}
