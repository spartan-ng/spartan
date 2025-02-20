import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
	selector: 'spartan-button-secondary',
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn variant="secondary">Secondary</button>
	`,
})
export class ButtonSecondaryComponent {}

export const secondaryCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'spartan-button-secondary',
  standalone: true,
  imports: [HlmButtonDirective],
  template: \`
    <button hlmBtn variant='secondary'>Secondary</button> \`,})
export class ButtonSecondaryComponent {}
`;
