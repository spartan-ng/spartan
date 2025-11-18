import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';

@Component({
	selector: 'spartan-button-group-separator',
	imports: [HlmButtonImports, HlmButtonGroupImports],
	template: `
		<div hlmButtonGroup>
			<button hlmBtn variant="secondary" size="sm">Copy</button>
			<hlm-button-group-separator />
			<button hlmBtn variant="secondary" size="sm">Paste</button>
		</div>
	`,
})
export class ButtonGroupSeparator {}
