import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';

@Component({
	selector: 'spartan-badge-secondary',
	imports: [HlmBadgeDirective],
	template: `
		<div hlmBadge variant="secondary">Secondary</div>
	`,
})
export class BadgeSecondaryExampleComponent {}
