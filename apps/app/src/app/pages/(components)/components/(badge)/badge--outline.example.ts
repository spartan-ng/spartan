import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';

@Component({
	selector: 'spartan-badge-outline',
	imports: [HlmBadgeDirective],
	template: `
		<div hlmBadge variant="outline">Outline</div>
	`,
})
export class BadgeOutlineExampleComponent {}

export const outlineCode = `
import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/helm/badge';

@Component({
  selector: 'spartan-badge-outline',
imports: [HlmBadgeDirective],
  template: \` <div hlmBadge variant="outline">Outline</div> \`,
})
export class BadgeOutlineExampleComponent {}
`;
