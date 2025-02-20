import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
	selector: 'spartan-button-destructive',
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn variant="destructive">Destructive</button>
	`,
})
export class ButtonDestructiveComponent {}

export const destructiveCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'spartan-button-destructive',
  standalone: true,
  imports: [HlmButtonDirective],
  template: \`
    <button hlmBtn variant='destructive'>Destructive</button> \`,})
export class ButtonDestructiveComponent {}
`;
