import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
	selector: 'spartan-button-anchor',
	imports: [HlmButtonDirective],
	template: `
		<a hlmBtn target="_blank" variant="link" href="https://github.com/goetzrobin/spartan">Star on GitHub</a>
	`,
})
export class ButtonAnchorComponent {}

export const anchorCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'spartan-button-anchor',
  standalone: true,
  imports: [HlmButtonDirective],
  template: \` <a hlmBtn target='_blank' variant="link" href="https://github.com/goetzrobin/spartan"> Star on GitHub </a> \`,
})
export class ButtonAnchorComponent {}
`;
