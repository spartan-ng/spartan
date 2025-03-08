import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

@Component({
	selector: 'spartan-badge-secondary',
	imports: [HlmBadgeDirective],
	template: `
		<div hlmBadge variant="secondary">Secondary</div>
	`,
})
export class BadgeSecondaryExampleComponent {}

export const secondaryCode = `
import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

@Component({
  selector: 'spartan-badge-secondary',
  standalone: true,
  imports: [HlmBadgeDirective],
  template: \` <div hlmBadge variant="secondary">Secondary</div> \`,
})
export class BadgeSecondaryExampleComponent {}
`;
