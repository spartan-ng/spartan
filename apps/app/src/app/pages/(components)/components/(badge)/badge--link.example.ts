import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

@Component({
	selector: 'spartan-badge-link',
	imports: [HlmBadgeImports, RouterLink, NgIcon],
	providers: [provideIcons({ lucideArrowUpRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex gap-2">
			<a hlmBadge routerLink=".">Angular Route</a>
			<a hlmBadge variant="secondary" href="https://spartan.ng" target="_blank" rel="noopener noreferrer">
				External Link
				<ng-icon name="lucideArrowUpRight" />
			</a>
		</div>
	`,
})
export class BadgeLink {}
