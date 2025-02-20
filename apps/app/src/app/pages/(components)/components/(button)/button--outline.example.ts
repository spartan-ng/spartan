import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
	selector: 'spartan-button-outline',
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn variant="outline">Outline</button>
	`,
})
export class ButtonOutlineComponent {}

export const outlineCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'spartan-button-outline',
  standalone: true,
  imports: [HlmButtonDirective],
  template: \`
    <button hlmBtn variant='outline'>Outline</button> \`,})
export class ButtonOutlineComponent {}
`;
