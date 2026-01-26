import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

@Component({
	selector: 'spartan-badge-variants-preview',
	imports: [HlmBadgeImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-full flex-wrap justify-center gap-2">
			<span hlmBadge>Badge</span>
			<span hlmBadge variant="secondary">Secondary</span>
			<span hlmBadge variant="destructive">Destructive</span>
			<span hlmBadge variant="outline">Outline</span>
			<span hlmBadge variant="ghost">Ghost</span>
		</div>
	`,
})
export class BadgeVariantsPreview {}
