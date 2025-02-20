import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

@Component({
	selector: 'spartan-badge-destructive',
	imports: [HlmBadgeDirective],
	template: `
		<div hlmBadge variant="destructive">Destructive</div>
	`,
})
export class BadgeDestructiveComponent {}

export const destructiveCode = `
import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

@Component({
  selector: 'spartan-badge-destructive',
  standalone: true,
  imports: [HlmBadgeDirective],
  template: \` <div hlmBadge variant='destructive'>Destructive</div> \`,
})
export class BadgeDestructiveComponent {}
`;
