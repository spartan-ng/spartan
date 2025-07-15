import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';

@Component({
	selector: 'spartan-badge-link',
	imports: [HlmBadgeDirective, RouterLink],
	template: `
		<div class="flex gap-2">
			<a hlmBadge routerLink=".">Angular Route</a>
			<a hlmBadge variant="secondary" href="https://spartan.ng">External Link</a>
		</div>
	`,
})
export class BadgeLinkComponent {}
