import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-link',
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn variant="link">Link</button>
	`,
})
export class ButtonLinkComponent {}

export const linkCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
  selector: 'spartan-button-link',
imports: [HlmButtonDirective],
  template: \`
    <button hlmBtn variant='link'>Link</button> \`,})
export class ButtonLinkComponent {}
`;
