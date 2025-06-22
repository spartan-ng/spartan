import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';

@Component({
	selector: 'spartan-badge-destructive',
	imports: [HlmBadgeDirective],
	template: `
		<div hlmBadge variant="destructive">Destructive</div>
	`,
})
export class BadgeDestructiveComponent {}
